package com.hutech.backend.repository;

import com.hutech.backend.entity.AddFriend;
import com.hutech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository extends JpaRepository<AddFriend, Integer> {
    List<AddFriend> findAddUsersByFriendIdAndStatus(int friendId, String status);
    AddFriend findAllByUserAndFriendAndStatus(User user, User friend, String status);
}
