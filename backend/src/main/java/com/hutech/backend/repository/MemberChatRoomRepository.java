package com.hutech.backend.repository;

import com.hutech.backend.entity.MemberChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MemberChatRoomRepository extends JpaRepository<MemberChatRoom, Integer> {
    List<MemberChatRoom> findAllByMemberId(Integer memberId);

    @Query("SELECT m.memberId FROM MemberChatRoom m WHERE m.chatroomId = :chatRoomId")
    List<Integer> findAllMemberIdByChatRoomId(Integer chatRoomId);

    MemberChatRoom findByMemberIdAndChatroomId(Integer memberId, Integer chatroomId);
//
//    List<Integer> findAllMemberIdByChatRoomId(Integer chatRoomId);
//    List<Integer> findAllMemberIdByChatRoomId(Integer chatRoomId);
}
