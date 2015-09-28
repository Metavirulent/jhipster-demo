package com.bitmen.studios.jhipster.demo.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bitmen.studios.jhipster.demo.domain.Conversation;
import com.bitmen.studios.jhipster.demo.domain.Message;
import com.bitmen.studios.jhipster.demo.repository.ConversationRepository;
import com.bitmen.studios.jhipster.demo.repository.search.ConversationSearchRepository;
import com.bitmen.studios.jhipster.demo.web.rest.dto.MessageDTO;
import com.bitmen.studios.jhipster.demo.web.rest.util.HeaderUtil;
import com.bitmen.studios.jhipster.demo.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Conversation.
 */
@RestController
@RequestMapping("/api")
public class ConversationResource {

    private final Logger log = LoggerFactory.getLogger(ConversationResource.class);

    @Inject
    private ConversationRepository conversationRepository;

    @Inject
    private ConversationSearchRepository conversationSearchRepository;

    /**
     * POST  /conversations -> Create a new conversation.
     */
    @RequestMapping(value = "/conversations",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Conversation> createConversation(@Valid @RequestBody Conversation conversation) throws URISyntaxException {
        log.debug("REST request to save Conversation : {}", conversation);
        if (conversation.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new conversation cannot already have an ID").body(null);
        }
        Conversation result = conversationRepository.save(conversation);
        conversationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/conversations/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("conversation", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /conversations -> Updates an existing conversation.
     */
    @RequestMapping(value = "/conversations",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Conversation> updateConversation(@Valid @RequestBody Conversation conversation) throws URISyntaxException {
        log.debug("REST request to update Conversation : {}", conversation);
        if (conversation.getId() == null) {
            return createConversation(conversation);
        }
        Conversation result = conversationRepository.save(conversation);
        conversationSearchRepository.save(conversation);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("conversation", conversation.getId().toString()))
                .body(result);
    }

    /**
     * GET  /conversations -> get all the conversations.
     */
    @RequestMapping(value = "/conversations",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Conversation>> getAllConversations(Pageable pageable)
        throws URISyntaxException {
        Page<Conversation> page = conversationRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/conversations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /conversations/:id -> get the "id" conversation.
     */
    @RequestMapping(value = "/conversations/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Conversation> getConversation(@PathVariable Long id) {
        log.debug("REST request to get Conversation : {}", id);
        return Optional.ofNullable(conversationRepository.findOneWithEagerRelationships(id))
            .map(conversation -> new ResponseEntity<>(
                conversation,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**Get all conversations that are newer than the given one.
     * 
     * @param id the ID of the Conversation the client has last received.
     * @return a response containing all conversations that are newer.
     */
    @RequestMapping(value="/conversation/new/{id}",
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Conversation>> getNewConversations(@PathVariable Long id) {
        log.debug("REST request to get new Conversations after : {}", id);
    	List<Conversation> newConversations=conversationRepository.findAllAfter(id);
    	log.debug("found {} entries",newConversations.size());
        return new ResponseEntity<>(newConversations, null, HttpStatus.OK);
    }


    /**
     * DELETE  /conversations/:id -> delete the "id" conversation.
     */
    @RequestMapping(value = "/conversations/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteConversation(@PathVariable Long id) {
        log.debug("REST request to delete Conversation : {}", id);
        conversationRepository.delete(id);
        conversationSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("conversation", id.toString())).build();
    }

    /**
     * SEARCH  /_search/conversations/:query -> search for the conversation corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/conversations/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Conversation> searchConversations(@PathVariable String query) {
        return StreamSupport
            .stream(conversationSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
