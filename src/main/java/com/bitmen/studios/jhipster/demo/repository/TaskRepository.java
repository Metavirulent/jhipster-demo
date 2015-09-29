package com.bitmen.studios.jhipster.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bitmen.studios.jhipster.demo.domain.Task;

/**
 * Spring Data JPA repository for the Task entity.
 */
public interface TaskRepository extends JpaRepository<Task,Long> {
	@Query("select t from Task t where t.project.id=:pid")
	Page<Task> findAllForProject(@Param("pid") Long pid,Pageable pageable);
}
