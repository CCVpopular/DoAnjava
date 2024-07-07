package com.hutech.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.hutech.backend.entity.AddFriend;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AddFriendDto {

        private int user;

        private int friend;

        private String status;

        private boolean hasRead;

        private LocalDateTime createdAt;

        List<AddFriend> friends;

        private String token;
}
