package com.hutech.backend.entity;

import lombok.Data;

@Data
public class MarkMessagesReadRequest {
    private Integer messageId;
    private String senderName;
    private String receiverName;
}
