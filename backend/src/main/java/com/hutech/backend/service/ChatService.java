package com.hutech.backend.service;

import com.hutech.backend.entity.Message;
import com.hutech.backend.entity.Status;
import com.hutech.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getPublicMessages(){
        return messageRepository.findByStatus(Status.MESSAGE);
    }

    public List<Message> getPrivateMessages(String sender, String receiver){
        return messageRepository.findBySenderNameAndReceiverNameOrReceiverNameAndSenderName(sender, receiver, sender, receiver);
    }


    public Message savePublicMessage(Message message) {
        LocalDateTime now  = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy--MM--dd HH:mm:ss");
        message.setDate(now.format(formatter));
        return messageRepository.save(message);
    }

    public Message savePrivateMessage(Message message) {
        LocalDateTime now  = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy--MM-dd HH:mm:ss");
        message.setDate(now.format(formatter));
        return messageRepository.save(message);
    }
}
