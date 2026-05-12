package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.PostRequest;
import com.lumilingua.crms.dto.responses.PostMentionResponse;
import com.lumilingua.crms.dto.responses.PostResponse;
import com.lumilingua.crms.entity.Post;
import com.lumilingua.crms.entity.PostMention;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.enums.PostType;
import com.lumilingua.crms.mapper.PostMapper;
import com.lumilingua.crms.mapper.PostMentionMapper;
import com.lumilingua.crms.repository.PostMentionRepository;
import com.lumilingua.crms.repository.PostRepository;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private static final Logger LOG = LoggerFactory.getLogger(PostServiceImpl.class);

    private final PostRepository postRepository;
    private final PostMentionRepository postMentionRepository;
    private final UserRepository userRepository;

    private List<PostMention> savePostMentionLogic(PostRequest request, long idPost) {
        List<PostMention> postMention = new ArrayList<>();
        if(request.getPostMentionRequests() != null && !request.getPostMentionRequests().isEmpty()) {
            List<PostMention> postMentions = request.getPostMentionRequests()
                    .stream()
                    .map(postMentionRequest -> {

                        User userMention = userRepository.findById(postMentionRequest.getIdUser())
                                .orElseThrow(() ->
                                        new EntityNotFoundException("The user mention is NOT exists!")
                                );

                        return PostMentionMapper.INSTANT.toPostMention(idPost, userMention.getIdUser());
                    }).toList();
            postMention = postMentionRepository.saveAll(postMentions);
        }
        return postMention;
    }

    private List<PostMentionResponse> buildMentionResponses(
            List<PostMention> mentions
    ) {

        if (mentions == null || mentions.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> mentionUserIds =
                mentions.stream()
                        .map(PostMention::getIdUser)
                        .toList();

        Map<Long, User> mentionUserMap =
                userRepository.findAllById(mentionUserIds)
                        .stream()
                        .collect(Collectors.toMap(
                                User::getIdUser,
                                user -> user
                        ));

        return mentions.stream()
                .map(mention -> {

                    User user =
                            mentionUserMap.get(
                                    mention.getIdUser()
                            );

                    return PostMentionMapper.INSTANT
                            .toMentionResponse(user);

                })
                .toList();
    }

    @Override
    @Transactional
    public Result<PostResponse> createOrCommentPost(PostRequest request) {
        LOG.info("Create post in service...");

        User userPost = userRepository.findById(request.getIdUser())
                .orElseThrow(() -> new EntityNotFoundException("The user post is NOT exists!")); //check user post
        if(request.getParentPostId() != null) {
            // COMMENT
            Post parentPost = postRepository.findById(request.getParentPostId())
                    .orElseThrow(() -> new EntityNotFoundException("The post is NOT exists!"));
            Long rootPostId = parentPost.getParentPostId() == null ? parentPost.getIdPost() : parentPost.getParentPostId();
            Post commentInPost = postRepository.save(PostMapper.INSTANT.toPost(userPost.getIdUser(), request.getContent(), rootPostId, PostType.COMMENT));
            List<PostMention> postMentions = savePostMentionLogic(request, commentInPost.getIdPost());
            return Result.create(PostMapper.INSTANT.toPostResponse(commentInPost, postMentions));
        } else {
            // POST
            Post post = postRepository.save(PostMapper.INSTANT.toPost(userPost.getIdUser(), request.getContent(), null, PostType.POST));
            List<PostMention> postMentions = savePostMentionLogic(request, post.getIdPost());
            return Result.create(PostMapper.INSTANT.toPostResponse(post, postMentions));
        }
    }

    @Override
    public Result<List<PostResponse>> getAllPostAndComment(
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        /*
         * STEP 1: GET ROOT POSTS
         */
        Page<Post> postPage =
                postRepository.findByPostTypeOrderByCreatedAtDesc(
                        PostType.POST,
                        pageable
                );

        List<Post> posts = postPage.getContent();

        if (posts.isEmpty()) {
            return Result.create(Collections.emptyList());
        }

        /*
         * STEP 2: ROOT POST IDS
         */
        List<Long> postIds = posts.stream()
                .map(Post::getIdPost)
                .toList();

        /*
         * STEP 3: GET COMMENTS
         */
        List<Post> allComments =
                postRepository.findByParentPostIdInOrderByCreatedAtDesc(postIds);

        /*
         * STEP 4: GROUP COMMENTS
         */
        Map<Long, List<Post>> commentMap =
                allComments.stream()
                        .collect(Collectors.groupingBy(
                                Post::getParentPostId
                        ));

        /*
         * STEP 5: ALL POST IDS
         */
        List<Long> allIds = new ArrayList<>(postIds);

        allIds.addAll(
                allComments.stream()
                        .map(Post::getIdPost)
                        .toList()
        );

        /*
         * STEP 6: MENTION MAP
         */
        Map<Long, List<PostMention>> mentionMap =
                postMentionRepository.findByIdPostIn(allIds)
                        .stream()
                        .collect(Collectors.groupingBy(
                                PostMention::getIdPost
                        ));

        /*
         * STEP 7: GET ALL USER IDS
         */
        List<Long> userIds = new ArrayList<>();

        userIds.addAll(
                posts.stream()
                        .map(Post::getIdUser)
                        .toList()
        );

        userIds.addAll(
                allComments.stream()
                        .map(Post::getIdUser)
                        .toList()
        );

        /*
         * STEP 8: USER MAP
         */
        Map<Long, User> userMap =
                userRepository.findAllById(userIds)
                        .stream()
                        .collect(Collectors.toMap(
                                User::getIdUser,
                                user -> user
                        ));

        /*
         * STEP 9: BUILD RESPONSE
         */
        List<PostResponse> responses = posts.stream()
                .map(post -> {

                    /*
                     * ONLY 3 COMMENTS PREVIEW
                     */
                    List<Post> previewComments =
                            commentMap.getOrDefault(
                                            post.getIdPost(),
                                            new ArrayList<>()
                                    )
                                    .stream()
                                    .limit(3)
                                    .toList();

                    /*
                     * COMMENT RESPONSES
                     */
                    List<PostResponse> commentResponses =
                            previewComments.stream()
                                    .map(comment -> {

                                        List<PostMentionResponse> mentions =
                                                buildMentionResponses(
                                                        mentionMap.getOrDefault(
                                                                comment.getIdPost(),
                                                                new ArrayList<>()
                                                        )
                                                );

                                        return PostMapper.INSTANT.toPostResponse(
                                                comment,
                                                mentions,
                                                userMap.get(comment.getIdUser())
                                        );
                                    })
                                    .toList();

                    /*
                     * ROOT POST RESPONSE
                     */
                    List<PostMentionResponse> mentions =
                            buildMentionResponses(
                                    mentionMap.getOrDefault(
                                            post.getIdPost(),
                                            new ArrayList<>()
                                    )
                            );

                    PostResponse response =
                            PostMapper.INSTANT.toPostResponse(
                                    post,
                                    mentions,
                                    userMap.get(post.getIdUser())
                            );

                    response.setComments(commentResponses);

                    response.setTotalComment(
                            commentMap.getOrDefault(
                                    post.getIdPost(),
                                    new ArrayList<>()
                            ).size()
                    );

                    return response;
                })
                .toList();

        return Result.create(responses);
    }

    @Override
    public Result<List<PostResponse>> getCommentsByPost(long idPost, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        /*
         * CHECK ROOT POST
         */
        postRepository.findById(idPost)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "The post is NOT exists!"
                        )
                );

        /*
         * GET COMMENTS
         */
        Page<Post> commentPage =
                postRepository.findByParentPostIdOrderByCreatedAtDesc(
                        idPost,
                        pageable
                );

        List<Post> comments = commentPage.getContent();

        if (comments.isEmpty()) {
            return Result.create(Collections.emptyList());
        }

        /*
         * COMMENT IDS
         */
        List<Long> commentIds = comments.stream()
                .map(Post::getIdPost)
                .toList();

        /*
         * GET MENTIONS BATCH
         */
        Map<Long, List<PostMention>> mentionMap =
                postMentionRepository.findByIdPostIn(commentIds)
                        .stream()
                        .collect(Collectors.groupingBy(
                                PostMention::getIdPost
                        ));

        /*
         * BUILD RESPONSE
         */
        List<PostResponse> responses =
                comments.stream()
                        .map(comment -> {

                            List<PostMentionResponse> mentions =
                                    buildMentionResponses(
                                            mentionMap.getOrDefault(
                                                    comment.getIdPost(),
                                                    new ArrayList<>()
                                            )
                                    );

                            User user =
                                    userRepository.findById(
                                            comment.getIdUser()
                                    ).orElse(null);

                            return PostMapper.INSTANT.toPostResponse(
                                    comment,
                                    mentions,
                                    user
                            );
                        })
                        .toList();

        return Result.create(responses);
    }
}
