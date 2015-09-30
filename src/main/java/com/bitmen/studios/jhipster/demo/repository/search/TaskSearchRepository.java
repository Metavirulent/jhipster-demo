package com.bitmen.studios.jhipster.demo.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.bitmen.studios.jhipster.demo.web.rest.dto.TaskDTO;

/**
 * Spring Data ElasticSearch repository for the Task entity.
 */
public interface TaskSearchRepository extends ElasticsearchRepository<TaskDTO, Long> {
}
