package com.lumilingua.crms.dto.requests;

import com.lumilingua.crms.entity.PostMention;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class PostRequest {
    private long idUser;
    private String content;
    private Long parentPostId;
    private List<PostMentionRequest> postMentionRequests;
}
