package com.hutech.backend.service;

import com.hutech.backend.dto.NewChatRoomDto;
import com.hutech.backend.dto.ReqRes;
import com.hutech.backend.entity.ChatRoom;
import com.hutech.backend.entity.MemberChatRoom;
import com.hutech.backend.entity.User;
import com.hutech.backend.repository.ChatRoomRepository;
import com.hutech.backend.repository.MemberChatRoomRepository;
import com.hutech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private MemberChatRoomRepository memberChatRoomRepository;

    public NewChatRoomDto addChatRoom(NewChatRoomDto newChatRoomDto) {
        try {
            User user = userRepository.findByName(newChatRoomDto.getUserName()).orElseThrow(() -> new RuntimeException("User not found"));
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setNameChatRoom(newChatRoomDto.getNameChatRoom());
            chatRoom.setOwnerId(user.getId());
            chatRoomRepository.save(chatRoom);
            MemberChatRoom memberChatRoom = new MemberChatRoom();
            memberChatRoom.setChatroomId(chatRoom.getId());
            memberChatRoom.setMemberId(user.getId());
            memberChatRoomRepository.save(memberChatRoom);
            newChatRoomDto.setStatusCode(200);
            newChatRoomDto.setStatusMessage("Success");
        }
        catch(Exception e) {
            newChatRoomDto.setStatusCode(500);
            newChatRoomDto.setStatusMessage(e.getMessage());
        }
        return newChatRoomDto;
    }

    public List<ChatRoom> getChatRooms(int userId) {
        List<ChatRoom> chatRooms = new ArrayList<>();
        try{
            List<MemberChatRoom> memberChatRooms = memberChatRoomRepository.findAllByMemberId(userId);
            List<Integer> chatroomIds = memberChatRooms.stream()
                    .map(MemberChatRoom::getChatroomId)
                    .collect(Collectors.toList());
            chatRooms = chatRoomRepository.findAllByIdIn(chatroomIds);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return chatRooms;
    }

    public ReqRes addMemberToChatRoom(int memBerId, int chatRoomId) {
        ReqRes reqRes = new ReqRes();
        try{
            reqRes.setStatusCode(200);
            reqRes.setMessage("The user is already in the chat room");
            MemberChatRoom memberChatRoom = memberChatRoomRepository.findByMemberIdAndChatroomId(memBerId, chatRoomId);
            if(memberChatRoom == null) {
                memberChatRoom = new MemberChatRoom();
                memberChatRoom.setChatroomId(chatRoomId);
                memberChatRoom.setMemberId(memBerId);
                memberChatRoomRepository.save(memberChatRoom);
                reqRes.setMessage("The user has been add in the chat room");
            }
        }
        catch(Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error while adding the member" + e.getMessage());
        }
        return reqRes;
    }
}
