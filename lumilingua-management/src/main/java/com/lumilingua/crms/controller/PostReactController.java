package com.lumilingua.crms.controller;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.PostReactRequest;
import com.lumilingua.crms.dto.responses.PostReactResponse;
import com.lumilingua.crms.service.PostReactService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/react")
public class PostReactController {
    private static final Logger LOG = LoggerFactory.getLogger(PostReactController.class);

    private final PostReactService postReactService;

    @PostMapping
    public ResponseEntity<Result<PostReactResponse>> reactPost(@RequestBody PostReactRequest request) {
        LOG.info("Like post in controller by api '%s'".formatted("/api/v1/react"));
        Result<PostReactResponse> response = postReactService.reactPost(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
