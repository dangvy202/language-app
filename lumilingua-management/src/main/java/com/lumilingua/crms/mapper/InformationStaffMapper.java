package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.InformationStaffRequest;
import com.lumilingua.crms.dto.responses.InformationStaffResponse;
import com.lumilingua.crms.entity.InformationStaff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InformationStaffMapper {
    InformationStaffMapper INSTANT = Mappers.getMapper(InformationStaffMapper.class);

    @Mapping(target = "scoreSpeaking", source = "request.scoreSpeaking")
    @Mapping(target = "scoreReading", source = "request.scoreReading")
    @Mapping(target = "scoreListening", source = "request.scoreListening")
    @Mapping(target = "scoreWriting", source = "request.scoreWriting")
    @Mapping(target = "certificatePath", source = "certificatePath")
    @Mapping(target = "status", constant = "INACTIVE")
    @Mapping(target = "expectedSalary", source = "request.expectedSalary")
    @Mapping(target = "idUser", source = "idUser")
    InformationStaff toInformationStaff(InformationStaffRequest request, String certificatePath, long idUser);

    InformationStaffResponse toInformationStaffResponse(InformationStaffRequest request);
}
