package com.bitmen.studios.jhipster.demo.repository;

import com.bitmen.studios.jhipster.demo.domain.Project;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Project entity.
 */
public interface ProjectRepository extends JpaRepository<Project,Long> {

    @Query("select project from Project project where project.owner.login = ?#{principal.username}")
    List<Project> findByOwnerIsCurrentUser();

}
