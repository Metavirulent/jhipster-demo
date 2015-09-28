package com.bitmen.studios.jhipster.demo.web.rest.dto;

import org.joda.time.DateTime;
import org.springframework.data.elasticsearch.annotations.Document;

import com.bitmen.studios.jhipster.demo.domain.Message;

/**The DTO object for {@link Message Message} to be exchanged with the client via REST.
 * @see MessageMapper
 * 
 * @author ATW10VA0
 *
 */
@Document(indexName="message")
public class MessageDTO {
	/**The unique ID of the message.*/
	private Long id;
	/**The content of the message.*/
	private String text;
	/**The author of the message.*/
	private String userLogin;
	/**The unique ID of the Conversation this message is part of.*/
	private Long conversationId;
	private DateTime createdDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String message) {
		this.text = message;
	}

	public String getUserLogin() {
		return userLogin;
	}

	public void setUserLogin(String userLogin) {
		this.userLogin = userLogin;
	}

	public Long getConversationId() {
		return conversationId;
	}

	public void setConversationId(Long conversationId) {
		this.conversationId = conversationId;
	}

	public DateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(DateTime createdDate) {
		this.createdDate = createdDate;
	}
}
