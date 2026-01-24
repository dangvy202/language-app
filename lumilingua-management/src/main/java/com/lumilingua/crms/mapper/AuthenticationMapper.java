package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.enums.GenderEnum;
import com.lumilingua.crms.enums.RoleEnum;
import com.lumilingua.crms.enums.StatusEnum;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AuthenticationMapper {
    AuthenticationMapper INSTANT = Mappers.getMapper(AuthenticationMapper.class);

    AuthenticationResponse toAuthenticationResponse(String token, long expired, String refreshToken);

    AuthenticationResponse.InformationResponse toInformationResponse(User user);

}
