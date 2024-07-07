package com.hutech.backend.controller;

import com.hutech.backend.entity.MarkMessagesReadRequest;
import com.hutech.backend.entity.Message;
import com.hutech.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        Message savedMessage = null;
        if (message.getMessage() != "" || message.getMessage() != null){
            savedMessage = messageService.savePrivateMessage(message);
        }
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", savedMessage);
    }

    @GetMapping("/api/messages/public")
    public List<Message> getPublicMessages() {
        return messageService.getPublicMessages();
    }

    @GetMapping("/api/messages/private")
    public List<Message> getPrivateMessages(@RequestParam String sender, @RequestParam String receiver) {
        return messageService.getPrivateMessages(sender, receiver);
    }

    @PostMapping("/api/messages/{id}/mark-as-read")
    public void markMessageAsRead(@PathVariable Integer id) {
        messageService.markMessageAsRead(id);
    }

    @PutMapping("/api/messages/mark-read")
    public ResponseEntity<String> markAllMessagesAsRead(@RequestBody MarkMessagesReadRequest request) {
        try {
            messageService.markAllMessagesAsRead(request.getSenderName(), request.getReceiverName());
            return ResponseEntity.ok().body("Marked all messages as read successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to mark messages as read.");
        }
    }

    @GetMapping("/api/messages/{id}/is-read")
    public boolean isMessageRead(@PathVariable Integer id) {
        return messageService.isMessageRead(id);
    }
}
