package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.CategoryLevelRequest;
import com.lumilingua.crms.dto.responses.CategoryLevelResponse;
import com.lumilingua.crms.entity.CategoryLevel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryLevelMapper {
    CategoryLevelMapper INSTANT = Mappers.getMapper(CategoryLevelMapper.class);

    CategoryLevel toCategoryLevelEntity(CategoryLevelRequest request);

    CategoryLevelResponse toCategoryLevelResponse(CategoryLevel categoryLevel);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    CategoryLevel updateCategoryLevelFromRequest(CategoryLevelRequest request, @MappingTarget CategoryLevel entity);
}
