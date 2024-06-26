package com.hutech.doanjava.chat;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatNofitication {
    private String id;
    private String senderId;
    private String recipientId;
    private String content;
}
