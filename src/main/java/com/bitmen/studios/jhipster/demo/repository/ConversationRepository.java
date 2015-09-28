package com.bitmen.studios.jhipster.demo.repository;

import com.bitmen.studios.jhipster.demo.domain.Conversation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Conversation entity.
 */
public interface ConversationRepository extends JpaRepository<Conversation,Long> {

    @Query("select distinct conversation from Conversation conversation left join fetch conversation.users")
    List<Conversation> findAllWithEagerRelationships();

    @Query("select conversation from Conversation conversation left join fetch conversation.users where conversation.id =:id")
    Conversation findOneWithEagerRelationships(@Param("id") Long id);
    
    @Query("select conversation from Conversation conversation, Conversation c where c.id=:id and conversation.createdDate>c.createdDate order by conversation.createdDate desc")
    List<Conversation> findAllAfter(@Param("id") Long id);

}
