package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.FeatureAppRequest;
import com.lumilingua.crms.dto.responses.FeatureAppResponse;
import com.lumilingua.crms.entity.FeatureApp;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FeatureAppMapper {
    FeatureAppMapper INSTANT = Mappers.getMapper(FeatureAppMapper.class);

    FeatureAppResponse toFeatureAppResponse(FeatureApp featureApp);

    FeatureApp toFeatureAppEntity(FeatureAppRequest request);

}
