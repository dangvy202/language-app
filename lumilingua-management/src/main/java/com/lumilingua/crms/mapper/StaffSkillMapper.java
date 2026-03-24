package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.StaffSkillRequest;
import com.lumilingua.crms.dto.responses.StaffSkillResponse;
import com.lumilingua.crms.entity.StaffSkill;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StaffSkillMapper {
    StaffSkillMapper INSTANT = Mappers.getMapper(StaffSkillMapper.class);

    StaffSkill toStaffSkillEntity(StaffSkillRequest request);

    StaffSkillResponse toStaffSkillResponse(StaffSkill request);
}
