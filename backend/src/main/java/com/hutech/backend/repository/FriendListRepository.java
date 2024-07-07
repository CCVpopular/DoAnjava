package com.hutech.backend.repository;

import com.hutech.backend.entity.FriendList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendListRepository extends JpaRepository<FriendList, Integer> {
}
