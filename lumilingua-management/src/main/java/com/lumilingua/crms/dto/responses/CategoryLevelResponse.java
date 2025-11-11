package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryLevelResponse {
    private String nameCategoryLevel;
    private String description;
    private float price;
}
