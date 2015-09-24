package com.bitmen.studios.jhipster.demo.repository.search;

import com.bitmen.studios.jhipster.demo.domain.Conversation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Conversation entity.
 */
public interface ConversationSearchRepository extends ElasticsearchRepository<Conversation, Long> {
}
