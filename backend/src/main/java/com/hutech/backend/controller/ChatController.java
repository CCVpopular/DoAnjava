package com.hutech.backend.controller;

import com.hutech.backend.entity.Message;
import com.hutech.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatService messageService;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message handleMessage(@Payload Message message) {
        // Lưu tin nhắn vào cơ sở dữ liệu trước khi gửi lại
        Message savedMessage = messageService.savePublicMessage(message);
        return savedMessage;
    }

    @MessageMapping("/private-message")
    public void handlePrivateMessage(@Payload Message message) {
        // Lưu tin nhắn vào cơ sở dữ liệu trước khi gửi lại
        Message savedMessage = messageService.savePrivateMessage(message);
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", savedMessage);
    }


}
