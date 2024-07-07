package com.hutech.backend.service;

import com.hutech.backend.dto.AddFriendDto;
import com.hutech.backend.dto.ReqRes;
import com.hutech.backend.entity.AddFriend;
import com.hutech.backend.entity.User;
import com.hutech.backend.repository.FriendRepository;
import com.hutech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FriendService {
    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    public AddFriend sendFriendRequest(AddFriendDto addFriendDto) {
        User user = userRepository.findById(addFriendDto.getUser()).orElseThrow(() -> new RuntimeException("User Not found"));
        User friend = userRepository.findById(addFriendDto.getFriend()).orElseThrow(() -> new RuntimeException("Friend Not found"));
        AddFriend addFriendRequest = new AddFriend();
        addFriendRequest.setUser(user);
        addFriendRequest.setFriend(friend);
        addFriendRequest.setStatus(addFriendDto.getStatus());
        addFriendRequest.setHasRead(addFriendDto.isHasRead());
        addFriendRequest.setCreatedAt(LocalDateTime.now());
        friendRepository.save(addFriendRequest);
        return addFriendRequest;
    }

    public AddFriendDto getaddFriendList (int userId) {
        AddFriendDto addFriendDto = new AddFriendDto();
        List<AddFriend> addFriendList = friendRepository.findAddUsersByFriendIdAndStatus(userId, "PENDING");
        addFriendDto.setFriends(addFriendList);
        return addFriendDto;
    }
}
