package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.PostReactRequest;
import com.lumilingua.crms.dto.responses.PostReactResponse;
import com.lumilingua.crms.entity.Post;
import com.lumilingua.crms.entity.PostReact;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.mapper.PostReactMapper;
import com.lumilingua.crms.repository.PostReactRepository;
import com.lumilingua.crms.repository.PostRepository;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.service.PostReactService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostReactServiceImpl implements PostReactService {
    private static final Logger LOG = LoggerFactory.getLogger(PostReactServiceImpl.class);

    private final PostReactRepository postReactRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public Result<PostReactResponse> reactPost(PostReactRequest request) {
        LOG.info("Like post in service...");
        User user = userRepository.findById(request.getIdUser()).orElseThrow(() -> new EntityNotFoundException("The user is NOT exists"));
        Post post = postRepository.findById(request.getIdPost()).orElseThrow(() -> new EntityNotFoundException("The post is NOT exists"));

        Optional<PostReact> postReact = postReactRepository.findPostReactByIdPostAndIdUser(request.getIdPost(), request.getIdUser());

        if(postReact.isEmpty()) {
           // Add like into post react
            PostReact saveRecord = postReactRepository.save(PostReactMapper.INSTANT.toPostReact(post.getIdPost(), user.getIdUser()));
            return Result.create(PostReactMapper.INSTANT.toPostReactResponse(saveRecord));
        } else {
            // Dislike into post react
            postReactRepository.delete(postReact.get());
            return Result.delete();
        }
    }
}
