package com.hutech.backend.controller;

import com.hutech.backend.entity.Message;
import com.hutech.backend.entity.StyleMessage;
import com.hutech.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    @PostMapping("/api/messages/sendMedia")
    public ResponseEntity<Message> sendMediaMessage(@RequestParam("senderName") String senderName,
                                                    @RequestParam("receiverName") String receiverName,
                                                    @RequestParam("file") MultipartFile file,
                                                    @RequestParam("styleMessage") StyleMessage styleMessage) {
        try {
            String mediaUrl = messageService.saveMedia(file); // lưu file và lấy URL

            Message message = new Message();// Tạo message và lưu vào cơ sở dữ liệu
            message.setSenderName(senderName);
            message.setReceiverName(receiverName);
            message.setMessage("");
            message.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            message.setStyleMessage(styleMessage);
            message.setMediaUrl(mediaUrl);

            Message savedMessage = messageService.savePrivateMessage(message); // Lưu message vào cơ sở dữ liệu và trả về response
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @MessageMapping("/private-message")
    public void handlePrivateMessage(@Payload Message message) {
        // Lưu tin nhắn vào cơ sở dữ liệu trước khi gửi lại
        Message savedMessage = message;
        if (message.getMessage() != "" || message.getMessage() != null){
            savedMessage = messageService.savePrivateMessage(message);
        }
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", savedMessage);
    }

    @GetMapping("/api/messages/public")
    public List<Message> getPublicMessages() {
        return messageService.getPublicMessages();
    }

    @GetMapping("/api/messages/private/{sender}/and/{receiver}")
    public List<Message> getPrivateMessages(@PathVariable String sender, @PathVariable String receiver) {
        return messageService.getPrivateMessages(sender, receiver);
    }

    @GetMapping("/api/messages/chatroom/{roomid}")
    public List<Message> getChatRoomMessages(@PathVariable int roomid) {
        return messageService.getChatRoomMessages(roomid);
    }

}
