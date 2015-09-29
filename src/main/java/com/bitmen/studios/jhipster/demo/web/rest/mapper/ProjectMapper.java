package com.bitmen.studios.jhipster.demo.web.rest.mapper;

import com.bitmen.studios.jhipster.demo.domain.*;
import com.bitmen.studios.jhipster.demo.web.rest.dto.ProjectDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Project and its DTO ProjectDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ProjectMapper {

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "owner.login", target = "ownerLogin")
    ProjectDTO projectToProjectDTO(Project project);

    @Mapping(source = "ownerId", target = "owner")
    Project projectDTOToProject(ProjectDTO projectDTO);

    default User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
