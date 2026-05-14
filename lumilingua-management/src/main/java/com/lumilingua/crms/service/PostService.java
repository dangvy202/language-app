package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.PostRequest;
import com.lumilingua.crms.dto.responses.PostResponse;

import java.util.List;

public interface PostService {
    Result<PostResponse> createOrCommentPost(PostRequest request);
    Result<List<PostResponse>> getAllPostAndComment(int page, int size, Long currentUserId);
    Result<List<PostResponse>> getCommentsByPost(long idPost, int page, int size);
}
