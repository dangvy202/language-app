package com.lumilingua.crms.dto.requests;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryLevelRequest {
    private String nameCategoryLevel;
    private String description;
    private float price;
}
