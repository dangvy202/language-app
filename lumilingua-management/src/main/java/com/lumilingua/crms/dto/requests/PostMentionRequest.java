package com.lumilingua.crms.dto.requests;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostMentionRequest {
    private long idUser;
}
