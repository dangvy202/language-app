package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.SkillRequest;
import com.lumilingua.crms.dto.responses.SkillResponse;
import com.lumilingua.crms.entity.Skills;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SkillMapper {
    SkillMapper INSTANT = Mappers.getMapper(SkillMapper.class);

    Skills toSkillEntity(SkillRequest request);

    SkillResponse toSkillResponse(Skills skill);
}
