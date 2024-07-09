package com.hutech.backend.service;

import com.hutech.backend.dto.NewChatRoomDto;
import com.hutech.backend.entity.ChatRoom;
import com.hutech.backend.entity.User;
import com.hutech.backend.repository.ChatRoomRepository;
import com.hutech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatRoomService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public NewChatRoomDto addChatRoom(NewChatRoomDto newChatRoomDto) {
        try {
            User user = userRepository.findByName(newChatRoomDto.getUserName()).orElseThrow(() -> new RuntimeException("User not found"));
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setNameChatRoom(newChatRoomDto.getNameChatRoom());
            chatRoom.setOwnerId(user.getId());
            chatRoomRepository.save(chatRoom);
            newChatRoomDto.setStatusCode(200);
            newChatRoomDto.setStatusMessage("Success");
        }
        catch(Exception e) {
            newChatRoomDto.setStatusCode(500);
            newChatRoomDto.setStatusMessage(e.getMessage());
        }
        return newChatRoomDto;
    }
}
