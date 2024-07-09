package com.hutech.backend.repository;

import com.hutech.backend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    List<ChatRoom> findAllByIdIn(List<Integer> ids);
}
