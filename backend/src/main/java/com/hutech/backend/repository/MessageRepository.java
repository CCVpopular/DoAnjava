package com.hutech.backend.repository;

import com.hutech.backend.entity.Message;
import com.hutech.backend.entity.Status;
import com.hutech.backend.entity.StyleMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByStatus(Status status);
    List<Message> findBySenderNameAndReceiverNameOrReceiverNameAndSenderName(String sender, String receiver, String receiver2, String sender2);

    List<Message> findBySenderNameAndReceiverNameAndReadMessageFalse(String sender, String receiver);

    List<Message> findAllByChatRoomid(int chatRoomid);

    List<Message> findAllByChatRoomidAndStyleMessageIsNot(int chatRoomid, StyleMessage styleMessage);
}
