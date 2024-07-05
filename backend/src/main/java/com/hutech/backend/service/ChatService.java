package com.hutech.backend.service;

import com.hutech.backend.entity.Message;
import com.hutech.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
public class ChatService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

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

    @Transactional // Đảm bảo transaction cho các thao tác lưu vào cơ sở dữ liệu
    public void sendMessage(Message chatMessage) {
        // Thực hiện logic lưu tin nhắn vào cơ sở dữ liệu

        messageRepository.save(chatMessage);
        // Gửi tin nhắn đến `/chatroom/public`
        messagingTemplate.convertAndSend("/chatroom/public", chatMessage);
    }

    public void sendPrivateMessage(Message chatMessage, String receiverName) {
        // Thực hiện logic lưu tin nhắn riêng tư vào cơ sở dữ liệu
        messageRepository.save(chatMessage);
        // Gửi tin nhắn đến `/user/{receiverName}/private`
        messagingTemplate.convertAndSendToUser(receiverName, "/private-message", chatMessage);
    }
}
