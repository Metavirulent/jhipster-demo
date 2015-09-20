package com.bitmen.studios.jhipster.demo.repository;

import com.bitmen.studios.jhipster.demo.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
