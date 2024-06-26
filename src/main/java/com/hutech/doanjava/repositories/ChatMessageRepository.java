package com.hutech.doanjava.repositories;

import com.hutech.doanjava.chat.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage,String> {
    List<ChatMessage> findByChatId(String s);
}
