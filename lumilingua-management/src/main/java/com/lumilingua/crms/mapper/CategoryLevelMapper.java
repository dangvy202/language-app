package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.CategoryLevelRequest;
import com.lumilingua.crms.dto.responses.CategoryLevelResponse;
import com.lumilingua.crms.entity.CategoryLevel;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface CategoryLevelMapper {
    CategoryLevelMapper INSTANT = Mappers.getMapper(CategoryLevelMapper.class);

    CategoryLevel toCategoryLevelEntity(String nameCategoryLevel, String description, BigDecimal price, BigDecimal actualPrice, int saleOff, String expiredDate);


    CategoryLevelResponse toCategoryLevelResponse(CategoryLevel categoryLevel);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "imgPath", ignore = true)
    CategoryLevel updateCategoryLevelFromRequest(CategoryLevelRequest request, @MappingTarget CategoryLevel entity);
}
