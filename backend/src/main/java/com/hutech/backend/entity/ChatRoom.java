package com.hutech.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table
@Data
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nameChatRoom;

//    @ManyToOne
//    @JoinColumn(name = "owner_id")
//    private User owner;

    @ManyToMany(mappedBy = "chatrooms")
    private Set<User> member = new HashSet<>();
}
