package com.bitmen.studios.jhipster.demo.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryString;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.inject.Inject;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bitmen.studios.jhipster.demo.domain.Message;
import com.bitmen.studios.jhipster.demo.repository.ConversationRepository;
import com.bitmen.studios.jhipster.demo.repository.MessageRepository;
import com.bitmen.studios.jhipster.demo.repository.UserRepository;
import com.bitmen.studios.jhipster.demo.repository.search.MessageSearchRepository;
import com.bitmen.studios.jhipster.demo.security.SecurityUtils;
import com.bitmen.studios.jhipster.demo.web.rest.dto.MessageDTO;
import com.bitmen.studios.jhipster.demo.web.rest.dto.MessageMapper;
import com.bitmen.studios.jhipster.demo.web.rest.util.HeaderUtil;
import com.bitmen.studios.jhipster.demo.web.rest.util.PaginationUtil;
import com.codahale.metrics.annotation.Timed;

/**
 * REST controller for managing Message.
 */
@RestController
@RequestMapping("/api")
@EnableAsync
public class MessageResource {

    private final Logger log = LoggerFactory.getLogger(MessageResource.class);

    @Inject
    private ConversationRepository conversationRepository;

    @Inject
    private MessageRepository messageRepository;

    @Inject
    private MessageSearchRepository messageSearchRepository;
    
    @Inject
    private UserRepository userRepository;
    
    @Inject
    private MessageMapper messageMapper;
  
 
    /**
     * POST  /messages -> Create a new message.
     */
    @RequestMapping(value = "/conversation/{cid}/messages",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MessageDTO> createMessage(@PathVariable Long cid,@RequestBody MessageDTO message) throws URISyntaxException {
        log.debug("REST request to save Message : {}", message);
        if (message.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new message cannot already have an ID").body(null);
        }
        message.setConversationId(cid);
        message.setUserLogin(SecurityUtils.getCurrentLogin());
        Message msg=new Message();
        msg.setConversation(conversationRepository.findOne(cid));
        msg.setText(message.getText());
        userRepository.findOneByLogin(message.getUserLogin())
        .map(user -> {
        	msg.setUser(user);
        	return user;
        });
        Message result = messageRepository.save(msg);
        messageSearchRepository.save(message);			//save message as it owns the relationship
        return ResponseEntity.created(new URI("/api/conversation/"+cid+"/messages/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("message", result.getId().toString()))
                .body(messageMapper.messageToMessageDTO(result));
    }
    
/*    @RequestMapping(value = "/conversation/{cid}/messages",
            method = RequestMethod.POST,
            consumes=MediaType.TEXT_PLAIN_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Message> createMessage(@PathVariable Long cid,String text) throws URISyntaxException {
    	log.debug("REST request to create new Message: {}",text);
    	Message message=new Message();
    	message.setConversation(conversationRepository.findOne(cid));
    	message.setText(text);
    	Optional<User> optionalUser=userRepository.findOneByLogin(SecurityUtils.getCurrentLogin());
    	if(optionalUser.isPresent())
    	message.setUser(optionalUser.get());
        message.getConversation().getMessages().add(0, message);		//add back-link from conversation to message
        Message result = messageRepository.save(message);
        messageSearchRepository.save(result);			//save message as it owns the relationship
    	return ResponseEntity.created(new URI("/api/conversation/"+cid+"/messages/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("message", result.getId().toString()))
                .body(result);
    }*/

    /**
     * PUT  /messages -> Updates an existing message.
     */
    @RequestMapping(value = "/conversation/{cid}/messages",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MessageDTO> updateMessage(@PathVariable Long cid,@Valid @RequestBody MessageDTO message) throws URISyntaxException {
        log.debug("REST request to update Message : {}", message);
        if (message.getId() == null) {				//message has no ID: create it instead of updating it
            return createMessage(cid,message);
        }
        Message msg=messageRepository.findOne(message.getId());
        msg.setText(message.getText());
        Message result = messageRepository.save(msg);
        messageSearchRepository.save(message);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("message", message.getId().toString()))
                .body(messageMapper.messageToMessageDTO(result));
    }

    /**
     * GET  /messages -> get all the messages.
     */
    @RequestMapping(value = "/conversation/{cid}/messages",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<MessageDTO>> getAllMessages(@PathVariable Long cid,Pageable pageable)
        throws URISyntaxException {
        Page<Message> page = messageRepository.findByConversation(cid, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/conversation/"+cid+"/api/messages");
        return new ResponseEntity<>(messageMapper.messagesToMessageDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /messages/:id -> get the "id" message.
     */
    @RequestMapping(value = "/conversation/{cid}/messages/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MessageDTO> getMessage(@PathVariable Long cid,@PathVariable Long id) {
        log.debug("REST request to get Message : {}", id);
        return Optional.ofNullable(messageRepository.findOne(id))
            .map(message -> new ResponseEntity<>(
                messageMapper.messageToMessageDTO(message),
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**Get all messages that are newer than the given message.
     * 
     * @param cid the ID of the Conversation.
     * @param id the ID of the Message the client has last received.
     * @return a response containing all messages that are newer.
     */
    @RequestMapping(value="/conversation/{cid}/new-messages/{id}",
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<MessageDTO>> getNewMessages(@PathVariable Long cid,@PathVariable Long id) {
        log.debug("REST request to get new Messages after : {}", id);
    	List<Message> newMessages=messageRepository.findAllAfter(cid,id);
    	log.debug("found {} entries",newMessages.size());
        return new ResponseEntity<>(messageMapper.messagesToMessageDTOs(newMessages), null, HttpStatus.OK);
    }

    /**
     * DELETE  /messages/:id -> delete the "id" message.
     */
    @RequestMapping(value = "/conversation/{cid}/messages/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteMessage(@PathVariable Long cid,@PathVariable Long id) {
        log.debug("REST request to delete Message : {}", id);
        messageRepository.delete(id);
        messageSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("message", id.toString())).build();
    }

    /**
     * SEARCH  /_search/messages/:query -> search for the message corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/messages/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<MessageDTO> searchMessages(@PathVariable String query) {
        return StreamSupport
            .stream(messageSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
