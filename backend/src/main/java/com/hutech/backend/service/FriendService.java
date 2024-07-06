package com.hutech.backend.service;

import com.hutech.backend.entity.Friend;
import com.hutech.backend.entity.User;
import com.hutech.backend.repository.FriendRepository;
import com.hutech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendService {
    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    public void sendFriendRequest(Integer userId, Integer friendId) {
        User user = userRepository.findById(userId).orElseThrow();
        User friend = userRepository.findById(friendId).orElseThrow();

        Friend friendRequest = new Friend();
        friendRequest.setUser(user);
        friendRequest.setFriend(friend);
        friendRequest.setStatus("PENDING");
        friendRepository.save(friendRequest);

    }
    public void acceptFriendRequest(Integer requestId) {
        Friend friendRequest = friendRepository.findById(requestId).orElseThrow();
        friendRequest.setStatus("ACCEPTED");
        friendRepository.save(friendRequest);
    }

    public List<Friend> getFriends(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return friendRepository.findByUserAndStatus(user, "ACCEPTED");
    }
}
