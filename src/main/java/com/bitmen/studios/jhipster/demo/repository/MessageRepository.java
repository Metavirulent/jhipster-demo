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
    
    /**Retrieve paged results of Messages for the given Conversation, ordered by the descending creation date.*/
    @Query("select message from Message message where message.conversation.id=:id order by message.lastModifiedDate desc")
    Page<Message> findByConversation(@Param("id") Long conversationId,Pageable pageable);

    @Query("select m from Message m, Message m2 where m.conversation.id=:cid and m2.id=:mid and m.lastModifiedDate>m2.lastModifiedDate order by m.lastModifiedDate desc")
    List<Message> findAllAfter(@Param("cid") Long conversationId,@Param("mid") Long messageId);
}
