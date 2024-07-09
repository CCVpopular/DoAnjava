package com.hutech.backend.repository;

import com.hutech.backend.entity.FriendList;
import com.hutech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendListRepository extends JpaRepository<FriendList, Integer> {
    @Query(value = "SELECT f.friend_id FROM FriendList f WHERE f.user_id = :userId", nativeQuery = true)
    List<Integer> findFriendIdsByUser(int userId);
    List<FriendList> findByUser(User user);
    FriendList findByUserIdAndFriendId(int userId, int friendId);
}
