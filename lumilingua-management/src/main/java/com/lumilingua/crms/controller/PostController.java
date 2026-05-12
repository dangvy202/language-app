package com.lumilingua.crms.controller;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.PostRequest;
import com.lumilingua.crms.dto.responses.PostResponse;
import com.lumilingua.crms.service.PostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/post")
public class PostController {
    private static final Logger LOG = LoggerFactory.getLogger(PostController.class);

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Result<PostResponse>> createOrCommentPost(@RequestBody PostRequest request) {
        LOG.info("Call api create or comment post '%s' by controller".formatted("/api/v1/post"));
        Result<PostResponse> respone = postService.createOrCommentPost(request);
        return new ResponseEntity<>(respone, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Result<List<PostResponse>>> getAllPostAndComment(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        LOG.info("Call API /api/v1/post - page: {}, size: {}", page, size);

        return new ResponseEntity<>(
                postService.getAllPostAndComment(page, size),
                HttpStatus.OK
        );
    }

    @GetMapping("/{idPost}/comment")
    public ResponseEntity<Result<List<PostResponse>>> getCommentsByPost(
            @PathVariable long idPost,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {

        LOG.info(
                "Call API /api/v1/post/{}/comment - page: {}, size: {}",
                idPost,
                page,
                size
        );

        return new ResponseEntity<>(
                postService.getCommentsByPost(idPost, page, size),
                HttpStatus.OK
        );
    }
}
