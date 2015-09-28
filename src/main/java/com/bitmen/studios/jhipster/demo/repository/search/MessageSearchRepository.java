package com.bitmen.studios.jhipster.demo.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.bitmen.studios.jhipster.demo.web.rest.dto.MessageDTO;

/**
 * Spring Data ElasticSearch repository for the Message entity.
 */
public interface MessageSearchRepository extends ElasticsearchRepository<MessageDTO, Long> {
}
