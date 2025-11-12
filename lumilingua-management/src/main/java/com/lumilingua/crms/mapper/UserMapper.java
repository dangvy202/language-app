package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANT = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "active" , constant = "false")
    @Mapping(target = "idCategoryLevel" , constant = "1")
    @Mapping(target = "status", expression = "java(com.lumilingua.crms.enums.StatusEnum.ACTIVE)")
    @Mapping(target = "role", expression = "java(com.lumilingua.crms.enums.RoleEnum.USER)")
    User toUserEntity(UserRequest request);

    UserResponse toUserResponse(User user);

}
