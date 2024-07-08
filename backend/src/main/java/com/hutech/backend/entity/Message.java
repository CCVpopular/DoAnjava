package com.hutech.backend.entity;

import jakarta.persistence.*;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String senderName;
    private String receiverName;

    private String message;
    private String date;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean readMessage;

    @Enumerated(EnumType.STRING)
    private StyleMessage styleMessage;

    private String mediaUrl; // URL của hình ảnh hoặc tệp được lưu trữ

    public void markAsRead(){
        this.readMessage = true;
    }
    public boolean isRead(){
        return this.readMessage;
    }

}
