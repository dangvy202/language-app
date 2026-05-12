package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.PostRequest;
import com.lumilingua.crms.dto.responses.PostMentionResponse;
import com.lumilingua.crms.dto.responses.PostResponse;
import com.lumilingua.crms.entity.Post;
import com.lumilingua.crms.entity.PostMention;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.enums.PostType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostMapper INSTANT = Mappers.getMapper(PostMapper.class);

    Post toPost(long idUser, String content, Long parentPostId, PostType postType);

    PostResponse toPostResponse(Post post, List<PostMention> postMention);

    Post toPost(
            Long idUser,
            String content,
            Long parentPostId,
            PostType postType
    );

    @Mapping(target = "idPost", source = "post.idPost")
    @Mapping(target = "idUser", source = "post.idUser")
    @Mapping(target = "content", source = "post.content")
    @Mapping(target = "totalReact", constant = "0L")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "avatar", source = "user.avatar")
    @Mapping(target = "mentions", source = "mentions")
    @Mapping(target = "createdAt", source = "post.createdAt")
    @Mapping(target = "updatedAt", source = "post.updatedAt")
    PostResponse toPostResponse(
            Post post,
            List<PostMentionResponse> mentions,
            User user
    );
}
