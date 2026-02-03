package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.responses.InformationAccountResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InformationAccountMapper {
    InformationAccountMapper INSTANT = Mappers.getMapper(InformationAccountMapper.class);

    InformationAccountResponse toInformationAccountResponse(int idUser, String phone, String email);
}
