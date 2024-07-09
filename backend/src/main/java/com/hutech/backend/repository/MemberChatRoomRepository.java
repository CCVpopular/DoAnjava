package com.hutech.backend.repository;

import com.hutech.backend.entity.MemberChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberChatRoomRepository extends JpaRepository<MemberChatRoom, Integer> {
    List<MemberChatRoom> findAllByMemberId(Integer memberId);
}
