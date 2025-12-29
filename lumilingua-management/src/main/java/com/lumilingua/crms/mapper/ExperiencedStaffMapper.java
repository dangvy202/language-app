package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.ExperiencedStaffRequest;
import com.lumilingua.crms.dto.responses.ExperiencedStaffResponse;
import com.lumilingua.crms.entity.ExperiencedStaff;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ExperiencedStaffMapper {
    ExperiencedStaffMapper INSTANT = Mappers.getMapper(ExperiencedStaffMapper.class);

    ExperiencedStaff toExperiencedStaff(ExperiencedStaffRequest request);

    ExperiencedStaffResponse toExperiencedStaffResponse(ExperiencedStaff experiencedStaff);
}
