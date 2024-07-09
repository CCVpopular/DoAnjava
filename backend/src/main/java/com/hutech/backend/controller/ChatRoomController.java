package com.hutech.backend.controller;

import com.hutech.backend.dto.NewChatRoomDto;
import com.hutech.backend.entity.ChatRoom;
import com.hutech.backend.entity.FriendList;
import com.hutech.backend.entity.Message;
import com.hutech.backend.entity.User;
import com.hutech.backend.service.ChatRoomService;
import com.hutech.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @MessageMapping("/newChatRoom")
    @SendTo("/chatroom/newRoom")
    public NewChatRoomDto handleMessage(@Payload NewChatRoomDto newChatRoomDto) {
        // Lưu tin nhắn vào cơ sở dữ liệu trước khi gửi lại
        NewChatRoomDto savedChatRoom = chatRoomService.addChatRoom(newChatRoomDto);
        return newChatRoomDto;
    }

    @GetMapping("/adminuser/getChatRooms/{userId}")
    public ResponseEntity<List<ChatRoom>> getChatRooms(@PathVariable int userId) {
        List<ChatRoom> chatRooms = chatRoomService.getChatRooms(userId);
        return ResponseEntity.ok(chatRooms);
    }
}
