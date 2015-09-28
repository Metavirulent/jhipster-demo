package com.bitmen.studios.jhipster.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bitmen.studios.jhipster.demo.domain.Message;

/**
 * Spring Data JPA repository for the Message entity.
 */
public interface MessageRepository extends JpaRepository<Message,Long> {

    @Query("select message from Message message where message.user.login = ?#{principal.username}")
    List<Message> findByUserIsCurrentUser();
    
    @Query("select message from Message message where message.user.login= ?#{principal.username} and message.conversation.id=:id order by message.createdDate desc")
    Page<Message> findByConversation(@Param("id") Long conversationId,Pageable pageable);
}
