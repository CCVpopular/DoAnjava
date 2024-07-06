package com.hutech.backend.controller;

import com.hutech.backend.entity.Friend;
import com.hutech.backend.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @PostMapping("/request")
    public ResponseEntity<String> sendFriendRequest(@RequestParam Integer userId, @RequestParam Integer friendId) {
        friendService.sendFriendRequest(userId, friendId);
        return ResponseEntity.ok("Friend request sent");
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriendRequest(@RequestParam Integer requestId) {
        friendService.acceptFriendRequest(requestId);
        return ResponseEntity.ok("Friend request accepted");
    }

    @GetMapping
    public ResponseEntity<List<Friend>> getFriends(@RequestParam Integer userId) {
        List<Friend> friends = friendService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }

}
