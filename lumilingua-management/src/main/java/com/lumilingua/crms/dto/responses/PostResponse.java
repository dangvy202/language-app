package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.entity.PostMention;
import com.lumilingua.crms.enums.PostType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
public class PostResponse {
    /*
     * POST INFO
     */
    private long idPost;
    private long idUser;
    private String content;
    private Long parentPostId;
    private PostType postType;
    private boolean isReacted;

    /*
     * USER INFO
     */
    private String username;
    private String avatar;

    /*
     * REACT INFO
     */
    private long totalReact;

    /*
     * COMMENT INFO
     */
    private long totalComment;

    /*
     * MENTION INFO
     */
    private List<PostMentionResponse> mentions;

    /*
     * COMMENTS
     */
    private List<PostResponse> comments;

    /*
     * TIME
     */
    private Date createdAt;

    private Date updatedAt;
}
