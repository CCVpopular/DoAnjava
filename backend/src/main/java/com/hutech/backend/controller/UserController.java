package com.hutech.backend.controller;

import com.hutech.backend.dto.ReqRes;
import com.hutech.backend.dto.resetP;
import com.hutech.backend.entity.Message;
import com.hutech.backend.entity.Status;
import com.hutech.backend.entity.User;
import com.hutech.backend.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    private UsersManagementService usersManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg){
        return ResponseEntity.ok(usersManagementService.register(reg));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/forgotPassword")
    public ResponseEntity<ReqRes> forgotPassword(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.forgotPassword(req));
    }

    @PostMapping("/auth/resetPassword")
    public ResponseEntity<resetP> resetPassword(@RequestBody resetP resetp){
        return ResponseEntity.ok(usersManagementService.resetPassword(resetp));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @GetMapping("/adminuser/get-users-byName/{nameFind}/butNot/{myName}")
    public ResponseEntity<ReqRes> getUsersByName(@PathVariable String nameFind, @PathVariable String myName){
        return ResponseEntity.ok(usersManagementService.getUsersByName(nameFind, myName));

    }

    @GetMapping("/adminuser/get-users-byNameNotInChatRoom/{nameFind}/butNot/{chatRoomId}")
    public ResponseEntity<ReqRes> getUsersByNameNotInChatRoom(@PathVariable String nameFind, @PathVariable int chatRoomId){
        return ResponseEntity.ok(usersManagementService.getUsersByNameNotInChatRoom(nameFind, chatRoomId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody User reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @MessageMapping("/imOnline")
    @SendTo("/chatroom/imOnline")
    public Message handleMessage(@Payload Message message) {
        Message savedMessage = message;
        if (message.getStatus() == Status.LEAVE){
            savedMessage = usersManagementService.setOffline(message);
        }
        else {
            savedMessage = usersManagementService.setOnline(message);
        }
        return savedMessage;
    }
}
