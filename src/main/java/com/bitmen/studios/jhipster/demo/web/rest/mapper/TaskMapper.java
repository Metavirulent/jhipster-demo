package com.bitmen.studios.jhipster.demo.web.rest.mapper;

import com.bitmen.studios.jhipster.demo.domain.*;
import com.bitmen.studios.jhipster.demo.web.rest.dto.TaskDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Task and its DTO TaskDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TaskMapper {

    @Mapping(source = "project.id", target = "projectId")
    TaskDTO taskToTaskDTO(Task task);

    @Mapping(source = "projectId", target = "project")
    Task taskDTOToTask(TaskDTO taskDTO);

    default Project projectFromId(Long id) {
        if (id == null) {
            return null;
        }
        Project project = new Project();
        project.setId(id);
        return project;
    }
}
