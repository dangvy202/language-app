package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.CategoryLevelRequest;
import com.lumilingua.crms.dto.responses.CategoryLevelResponse;

import java.util.List;

public interface CategoryLevelService {
//  Role Admin
    Result<CategoryLevelResponse> createCategoryLevel(CategoryLevelRequest request);
    Result<List<CategoryLevelResponse>> getAllCategoryLevel();
    Result<CategoryLevelResponse> getCategoryLevelById(long id);
}
