package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.CategoryLevelRequest;
import com.lumilingua.crms.dto.responses.CategoryLevelResponse;
import com.lumilingua.crms.service.CategoryLevelService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/category-level")
public class CategoryLevelController {
    private static final Logger LOG = LoggerFactory.getLogger(CategoryLevelController.class);
    
    private final CategoryLevelService categoryLevelService;

    @GetMapping
    public ResponseEntity<Result<List<CategoryLevelResponse>>> getAllCategoryLevel() {
        LOG.info("Call api get all category level '%s' by controller".formatted("/api/v1/category-level"));
        Result<List<CategoryLevelResponse>> results = categoryLevelService.getAllCategoryLevel();
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/id")
    public ResponseEntity<Result<CategoryLevelResponse>> getCategoryById(@RequestParam("id") long id) {
        LOG.info("Call api get category level by id '%s'".formatted("/api/v1/category-level/id?id=" + id));
        Result<CategoryLevelResponse> result = categoryLevelService.getCategoryLevelById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Result<CategoryLevelResponse>> createCategoryLevel(@RequestBody CategoryLevelRequest categoryLevelRequest) {
        LOG.info("Call api create category level '%s' by controller".formatted("/api/v1/category-level"));
        Result<CategoryLevelResponse> result = categoryLevelService.createCategoryLevel(categoryLevelRequest);
        if(result.code == ResultApiConstant.StatusCode.CREATED) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/id")
    public ResponseEntity<Result<CategoryLevelResponse>> updateCategoryById(@RequestParam("id") long id, @RequestBody CategoryLevelRequest categoryLevelRequest) {
        LOG.info("Call api update category level by id '%s'".formatted("/api/v1/category-level/id?id=" + id));
        Result<CategoryLevelResponse> result = categoryLevelService.updateCategoryLevelById(id, categoryLevelRequest);
        if(result.code == ResultApiConstant.StatusCode.NO_CONTENT) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/id")
    public ResponseEntity<Result<CategoryLevelResponse>> deleteCategoryById(@RequestParam("id") long id) {
        LOG.info("Call api update category level by id '%s'".formatted("/api/v1/category-level/id?id=" + id));
        Result<CategoryLevelResponse> result = categoryLevelService.deleteCategoryLevelById(id);
        if(result.code == ResultApiConstant.StatusCode.NO_CONTENT) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
