package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Getter
@Setter
@AllArgsConstructor
public class CategoryLevelResponse {
    private String nameCategoryLevel;
    private String description;
    private BigDecimal price;
    private BigDecimal actualPrice;
    private long saleOff;
    private String expiredDate;
    private String imgPath;
}
