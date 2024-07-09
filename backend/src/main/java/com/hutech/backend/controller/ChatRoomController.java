package com.hutech.backend.controller;

import com.hutech.backend.dto.NewChatRoomDto;
import com.hutech.backend.entity.Message;
import com.hutech.backend.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @MessageMapping("/newChatRoom")
    @SendTo("/chatroom/newRoom")
    public NewChatRoomDto handleMessage(@Payload NewChatRoomDto newChatRoomDto) {
        // Lưu tin nhắn vào cơ sở dữ liệu trước khi gửi lại
        NewChatRoomDto savedChatRoom = chatRoomService.addChatRoom(newChatRoomDto);
        return chatRoomService.addChatRoom(savedChatRoom);
    }




}
