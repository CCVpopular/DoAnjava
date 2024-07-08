package com.hutech.backend.service;

import com.hutech.backend.dto.AddFriendDto;
import com.hutech.backend.dto.ReqRes;
import com.hutech.backend.entity.AddFriend;
import com.hutech.backend.entity.FriendList;
import com.hutech.backend.entity.User;
import com.hutech.backend.repository.FriendListRepository;
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
    private FriendListRepository friendlistRepository;

    @Autowired
    private UserRepository userRepository;

    public AddFriend sendFriendRequest(AddFriendDto addFriendDto) {
        User user = userRepository.findById(addFriendDto.getUser()).orElseThrow(() -> new RuntimeException("User Not found"));
        User friend = userRepository.findById(addFriendDto.getFriend()).orElseThrow(() -> new RuntimeException("Friend Not found"));
        AddFriend addFriend = friendRepository.findAllByUserAndFriendAndStatus(user, friend, "PENDING");
        AddFriend addFriend1 = friendRepository.findAllByUserAndFriendAndStatus(user, friend, "ACCEPT");
        AddFriend addFriendRequest = new AddFriend();
            addFriendRequest.setUser(user);
            addFriendRequest.setFriend(friend);
            addFriendRequest.setStatus("dontSave");

            addFriendRequest.setHasRead(addFriendDto.isHasRead());
            addFriendRequest.setCreatedAt(LocalDateTime.now());
        if (addFriend == null && addFriend1 == null) {
            addFriendRequest.setStatus(addFriendDto.getStatus());
            friendRepository.save(addFriendRequest);
        }
        return addFriendRequest;
    }

    public AddFriendDto getaddFriendList (int userId) {
        AddFriendDto addFriendDto = new AddFriendDto();
        List<AddFriend> addFriendList = friendRepository.findAddUsersByFriendIdAndStatus(userId, "PENDING");
        addFriendDto.setFriends(addFriendList);
        return addFriendDto;
    }

    public AddFriendDto AcceptFriend (int Id) {
        AddFriendDto addFriendDto = new AddFriendDto();
        AddFriend acceptFriend = friendRepository.findById(Id).orElseThrow(() -> new RuntimeException("FriendList Not found"));
        acceptFriend.setStatus("ACCEPT");
        friendRepository.save(acceptFriend);
        addFriendDto.setStatusCode(200);
        addFriendDto.setMessage("Friend Accepted");
        FriendList myself = new FriendList();
        myself.setUser(acceptFriend.getUser());
        myself.setFriend(acceptFriend.getFriend());
        friendlistRepository.save(myself);
        FriendList friend = new FriendList();
        friend.setUser(acceptFriend.getFriend());
        friend.setFriend(acceptFriend.getUser());
        friendlistRepository.save(friend);
        return addFriendDto;
    }

    public AddFriendDto DenyFriend (int Id) {
        AddFriendDto addFriendDto = new AddFriendDto();
        AddFriend acceptFriend = friendRepository.findById(Id).orElseThrow(() -> new RuntimeException("FriendList Not found"));
        acceptFriend.setStatus("DENY");
        friendRepository.save(acceptFriend);
        addFriendDto.setStatusCode(200);
        addFriendDto.setMessage("Friend Deny");
        return addFriendDto;
    }

    public List<FriendList> getFriendListByUserId(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User Not found"));
        return friendlistRepository.findByUser(user);
    }
}
