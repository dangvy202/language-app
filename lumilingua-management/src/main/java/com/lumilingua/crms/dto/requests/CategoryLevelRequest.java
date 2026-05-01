package com.lumilingua.crms.dto.requests;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CategoryLevelRequest {
    private String nameCategoryLevel;
    private String description;
    private BigDecimal price;
    private int saleOff;
    private String expiredDate;
    private String status;
    private MultipartFile imgPath;
}
