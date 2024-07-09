package com.hutech.backend.controller;

import com.hutech.backend.dto.AddFriendDto;
import com.hutech.backend.dto.ReqRes;
import com.hutech.backend.entity.AddFriend;
import com.hutech.backend.entity.FriendList;
import com.hutech.backend.entity.User;
import com.hutech.backend.repository.FriendListRepository;
import com.hutech.backend.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class FriendController {

    @Autowired
    private FriendService friendService;

    @Autowired
    private FriendListRepository friendListRepository;

    @MessageMapping("/add-friend")
    @SendTo("/addFriend/req")
    public AddFriend handleAddFriend(@Payload AddFriendDto addFriendDto) {
        return friendService.sendFriendRequest(addFriendDto);
    }

    @GetMapping("/adminuser/get-addFriendList/{userId}")
    public ResponseEntity<AddFriendDto> getAddFriendList(@PathVariable int userId){
        return ResponseEntity.ok(friendService.getaddFriendList(userId));
    }

    @PutMapping("/adminuser/acceptFriend/{Id}")
    public ResponseEntity<AddFriendDto> AcceptFriend(@PathVariable int Id){
        return ResponseEntity.ok(friendService.AcceptFriend(Id));
    }

    @PutMapping("/adminuser/denyFriend/{Id}")
    public ResponseEntity<AddFriendDto> DenyFriend(@PathVariable int Id){
        return ResponseEntity.ok(friendService.DenyFriend(Id));
    }

    @GetMapping("/adminuser/getFriends/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable int userId) {
        List<FriendList> friendList = friendService.getFriendListByUserId(userId);
        List<User> friends = friendList.stream().map(FriendList::getFriend).collect(Collectors.toList());
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/adminuser/connectionstring")
    public ResponseEntity<String> getConnectionString(@RequestParam int userId, @RequestParam int friendId) {
        FriendList friendList = friendListRepository.findByUserIdAndFriendId(userId, friendId);
        if (friendList != null) {
            return ResponseEntity.ok(friendList.getConnectionstring());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}