package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANT = Mappers.getMapper(UserMapper.class);

    User toUserEntity(UserRequest request);

}
