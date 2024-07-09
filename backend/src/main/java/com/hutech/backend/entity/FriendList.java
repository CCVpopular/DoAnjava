package com.hutech.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "friendlist")
@Data
public class FriendList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private User friend;

    private String connectionString;
}
