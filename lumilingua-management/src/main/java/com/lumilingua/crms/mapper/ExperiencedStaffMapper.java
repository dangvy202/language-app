package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.ExperiencedStaffRequest;
import com.lumilingua.crms.dto.responses.ExperiencedStaffResponse;
import com.lumilingua.crms.entity.ExperiencedStaff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExperiencedStaffMapper {
    ExperiencedStaffMapper INSTANT = Mappers.getMapper(ExperiencedStaffMapper.class);

    @Mapping(target = "yearsOfExperience", source = "yearsOfExperience")
    ExperiencedStaff toExperiencedStaff(ExperiencedStaffRequest request, double yearsOfExperience);

    List<ExperiencedStaff> toExperiencedStaffList(List<ExperiencedStaffRequest> requests);
}
