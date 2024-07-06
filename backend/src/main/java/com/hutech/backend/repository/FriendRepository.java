package com.hutech.backend.repository;

import com.hutech.backend.entity.Friend;
import com.hutech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Integer> {
    List<Friend> findByUserAndStatus(User user, String status);
    List<Friend> findByFriendAndStatus(User friend, String status);
    Optional<Friend> findByUserAndFriend(User user, User friend);
}
