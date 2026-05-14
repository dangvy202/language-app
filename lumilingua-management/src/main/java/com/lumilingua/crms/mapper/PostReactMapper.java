package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.PostReactRequest;
import com.lumilingua.crms.dto.responses.PostReactResponse;
import com.lumilingua.crms.entity.PostReact;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PostReactMapper {
    PostReactMapper INSTANT = Mappers.getMapper(PostReactMapper.class);

    PostReact toPostReact(long idPost, long idUser);

    PostReactResponse toPostReactResponse(PostReact postReact);
}
