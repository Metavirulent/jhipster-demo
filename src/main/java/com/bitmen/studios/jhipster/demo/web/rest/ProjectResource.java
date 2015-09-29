package com.bitmen.studios.jhipster.demo.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bitmen.studios.jhipster.demo.domain.Project;
import com.bitmen.studios.jhipster.demo.repository.ProjectRepository;
import com.bitmen.studios.jhipster.demo.repository.search.ProjectSearchRepository;
import com.bitmen.studios.jhipster.demo.web.rest.util.HeaderUtil;
import com.bitmen.studios.jhipster.demo.web.rest.util.PaginationUtil;
import com.bitmen.studios.jhipster.demo.web.rest.dto.ProjectDTO;
import com.bitmen.studios.jhipster.demo.web.rest.mapper.ProjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Project.
 */
@RestController
@RequestMapping("/api")
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private ProjectMapper projectMapper;

    @Inject
    private ProjectSearchRepository projectSearchRepository;

    /**
     * POST  /projects -> Create a new project.
     */
    @RequestMapping(value = "/projects",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO) throws URISyntaxException {
        log.debug("REST request to save Project : {}", projectDTO);
        if (projectDTO.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new project cannot already have an ID").body(null);
        }
        Project project = projectMapper.projectDTOToProject(projectDTO);
        Project result = projectRepository.save(project);
        projectSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/projects/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("project", result.getId().toString()))
                .body(projectMapper.projectToProjectDTO(result));
    }

    /**
     * PUT  /projects -> Updates an existing project.
     */
    @RequestMapping(value = "/projects",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> updateProject(@Valid @RequestBody ProjectDTO projectDTO) throws URISyntaxException {
        log.debug("REST request to update Project : {}", projectDTO);
        if (projectDTO.getId() == null) {
            return createProject(projectDTO);
        }
        Project project = projectMapper.projectDTOToProject(projectDTO);
        Project result = projectRepository.save(project);
        projectSearchRepository.save(project);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("project", projectDTO.getId().toString()))
                .body(projectMapper.projectToProjectDTO(result));
    }

    /**
     * GET  /projects -> get all the projects.
     */
    @RequestMapping(value = "/projects",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProjectDTO>> getAllProjects(Pageable pageable)
        throws URISyntaxException {
        Page<Project> page = projectRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/projects");
        return new ResponseEntity<>(page.getContent().stream()
            .map(projectMapper::projectToProjectDTO)
            .collect(Collectors.toCollection(LinkedList::new)), headers, HttpStatus.OK);
    }

    /**
     * GET  /projects/:id -> get the "id" project.
     */
    @RequestMapping(value = "/projects/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        return Optional.ofNullable(projectRepository.findOne(id))
            .map(projectMapper::projectToProjectDTO)
            .map(projectDTO -> new ResponseEntity<>(
                projectDTO,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /projects/:id -> delete the "id" project.
     */
    @RequestMapping(value = "/projects/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);
        projectRepository.delete(id);
        projectSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("project", id.toString())).build();
    }

    /**
     * SEARCH  /_search/projects/:query -> search for the project corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/projects/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Project> searchProjects(@PathVariable String query) {
        return StreamSupport
            .stream(projectSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
