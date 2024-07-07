package com.hutech.backend.repository;

import com.hutech.backend.entity.AddFriend;
import com.hutech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<AddFriend, Integer> {
    List<AddFriend> findAddUsersByFriendIdAndStatus(int friendId, String status);
}
