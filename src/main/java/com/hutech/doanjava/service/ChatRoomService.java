package com.hutech.doanjava.service;

import com.hutech.doanjava.chatroom.ChatRoom;
import com.hutech.doanjava.repositories.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatRoomId(String senderId,
                                          String recipientId,
                                          boolean createNewRoomIfNotExists){
        return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoom::getChatId)
                .or(() ->{
                    if(createNewRoomIfNotExists){
                        var chatId = createChat(senderId, recipientId);
                        return Optional.of(chatId);
                    }
                    return Optional.empty();
                });
    }

    private String createChat(String senderId, String recipientId) {
        var chatId = String.format("%s_%s",senderId, recipientId);
        ChatRoom senderRecipient = ChatRoom.builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();
        ChatRoom recippientSender = ChatRoom.builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recippientSender);
        return null;
    }
}
