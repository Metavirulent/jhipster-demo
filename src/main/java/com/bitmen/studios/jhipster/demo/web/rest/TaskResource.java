package com.bitmen.studios.jhipster.demo.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bitmen.studios.jhipster.demo.domain.Task;
import com.bitmen.studios.jhipster.demo.repository.TaskRepository;
import com.bitmen.studios.jhipster.demo.repository.search.TaskSearchRepository;
import com.bitmen.studios.jhipster.demo.web.rest.util.HeaderUtil;
import com.bitmen.studios.jhipster.demo.web.rest.util.PaginationUtil;
import com.bitmen.studios.jhipster.demo.web.rest.dto.TaskDTO;
import com.bitmen.studios.jhipster.demo.web.rest.mapper.TaskMapper;

import org.jboss.logging.annotations.Param;
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
 * REST controller for managing Task.
 */
@RestController
@RequestMapping("/api")
public class TaskResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private TaskSearchRepository taskSearchRepository;

    /**
     * POST  /tasks -> Create a new task.
     */
    @RequestMapping(value = "/project/{pid}/tasks",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> createTask(@PathVariable Long pid,@Valid @RequestBody TaskDTO taskDTO) throws URISyntaxException {
        log.debug("REST request to save Task : {}", taskDTO);
        if (taskDTO.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new task cannot already have an ID").body(null);
        }
        Task task = taskMapper.taskDTOToTask(taskDTO);
        Task result = taskRepository.save(task);
        taskSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tasks/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("task", result.getId().toString()))
                .body(taskMapper.taskToTaskDTO(result));
    }

    /**
     * PUT  /tasks -> Updates an existing task.
     */
    @RequestMapping(value = "/project/{pid}/tasks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long pid,@Valid @RequestBody TaskDTO taskDTO) throws URISyntaxException {
        log.debug("REST request to update Task : {}", taskDTO);
        if (taskDTO.getId() == null) {
            return createTask(pid,taskDTO);
        }
        Task task = taskMapper.taskDTOToTask(taskDTO);
        Task result = taskRepository.save(task);
        taskSearchRepository.save(task);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("task", taskDTO.getId().toString()))
                .body(taskMapper.taskToTaskDTO(result));
    }

    /**
     * GET  /tasks -> get all the tasks.
     */
    @RequestMapping(value = "/project/{pid}/tasks",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<TaskDTO>> getAllTasks(@PathVariable Long pid,Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get Tasks for project : {}", pid);
        Page<Task> page = taskRepository.findAllForProject(pid,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tasks");
        return new ResponseEntity<>(page.getContent().stream()
            .map(taskMapper::taskToTaskDTO)
            .collect(Collectors.toCollection(LinkedList::new)), headers, HttpStatus.OK);
    }

    /**
     * GET  /tasks/:id -> get the "id" task.
     */
    @RequestMapping(value = "/project/{pid}/tasks/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long id) {
        log.debug("REST request to get Task : {}", id);
        return Optional.ofNullable(taskRepository.findOne(id))
            .map(taskMapper::taskToTaskDTO)
            .map(taskDTO -> new ResponseEntity<>(
                taskDTO,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /tasks/:id -> delete the "id" task.
     */
    @RequestMapping(value = "/project/{pid}/tasks/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        log.debug("REST request to delete Task : {}", id);
        taskRepository.delete(id);
        taskSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("task", id.toString())).build();
    }

    /**
     * SEARCH  /_search/tasks/:query -> search for the task corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/tasks/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Task> searchTasks(@PathVariable String query) {
        return StreamSupport
            .stream(taskSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
