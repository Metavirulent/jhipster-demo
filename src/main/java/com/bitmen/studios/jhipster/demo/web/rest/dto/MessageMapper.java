package com.bitmen.studios.jhipster.demo.web.rest.dto;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.bitmen.studios.jhipster.demo.domain.Message;

/**Maps {@link Message Message} entities to {@link MessageDTO MessageDTO} data transfer objects.
 * 
 * @author ATW10VA0
 *
 */
@Component
@Mapper(componentModel="spring")
public interface MessageMapper {
	/**Convert a single MessageDTO to a Message.*/
	@Mapping(source="conversation.id",target="conversationId")
	@Mapping(source="user.login",target="userLogin")
	MessageDTO messageToMessageDTO(Message message);
	/**Convert a List of MessageDTOs to a List of Messages.*/
	List<MessageDTO> messagesToMessageDTOs(List<Message> messages);
}
