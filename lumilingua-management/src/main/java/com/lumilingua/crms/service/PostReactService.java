package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.PostReactRequest;
import com.lumilingua.crms.dto.responses.PostReactResponse;

public interface PostReactService {
    Result<PostReactResponse> reactPost(PostReactRequest request);
}
