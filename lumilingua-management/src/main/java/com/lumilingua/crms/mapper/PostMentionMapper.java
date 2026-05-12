package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.responses.PostMentionResponse;
import com.lumilingua.crms.entity.PostMention;
import com.lumilingua.crms.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PostMentionMapper {
    PostMentionMapper INSTANT = Mappers.getMapper(PostMentionMapper.class);

    PostMention toPostMention(long idPost, long idUser);

    @Mapping(target = "idUser", source = "idUser")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "avatar", source = "avatar")
    PostMentionResponse toMentionResponse(User user);

}
