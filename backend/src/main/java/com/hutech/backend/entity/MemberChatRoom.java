package com.hutech.backend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "memberchatroom")
@Data
public class MemberChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int memberId;

    private int chatroomId;
}
