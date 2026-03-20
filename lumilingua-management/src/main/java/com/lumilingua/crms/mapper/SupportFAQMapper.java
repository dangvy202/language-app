package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.SupportFAQRequest;
import com.lumilingua.crms.dto.responses.FeatureAppResponse;
import com.lumilingua.crms.dto.responses.SupportFAQResponse;
import com.lumilingua.crms.entity.SupportFAQ;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SupportFAQMapper {
    SupportFAQMapper INSTANT = Mappers.getMapper(SupportFAQMapper.class);

    SupportFAQ toSupportFAQ(SupportFAQRequest request);

    SupportFAQResponse toSupportFAQResponse(SupportFAQ supportFAQ);
}
