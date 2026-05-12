package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostMentionResponse {

    private Long idUser;

    private String username;

    private String avatar;
}