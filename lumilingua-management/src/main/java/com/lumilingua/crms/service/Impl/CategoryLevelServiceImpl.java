package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.CategoryLevelRequest;
import com.lumilingua.crms.dto.responses.CategoryLevelResponse;
import com.lumilingua.crms.entity.CategoryLevel;
import com.lumilingua.crms.mapper.CategoryLevelMapper;
import com.lumilingua.crms.repository.CategoryLevelRepository;
import com.lumilingua.crms.service.CategoryLevelService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryLevelServiceImpl implements CategoryLevelService {
    private static final Logger LOG = LoggerFactory.getLogger(CategoryLevelServiceImpl.class);

    private final CategoryLevelRepository categoryLevelRepository;

    @Override
    public Result<CategoryLevelResponse> createCategoryLevel(CategoryLevelRequest request) {
        LOG.info("Create category level in service...");
        try {
            CategoryLevel categoryLevelEntityMapper = CategoryLevelMapper.INSTANT.toCategoryLevelEntity(request);
            CategoryLevel categoryLevel = categoryLevelRepository.save(categoryLevelEntityMapper);
            LOG.info("Create category level is SUCCESS!");
            CategoryLevelResponse response = CategoryLevelMapper.INSTANT.toCategoryLevelResponse(categoryLevel);
            return Result.create(response);
        } catch (Exception ex) {
            LOG.error("Create category level is FAILED!");
            return Result.serverError("Create category level is FAILED!");
        }
    }

    @Override
    public Result<List<CategoryLevelResponse>> getAllCategoryLevel() {
        LOG.info("Get all category level in service...");
        List<CategoryLevel> categoryLevelList = categoryLevelRepository.findAll();
        List<CategoryLevelResponse> responses = categoryLevelList.stream().map(CategoryLevelMapper.INSTANT::toCategoryLevelResponse).toList();
        return Result.getAll(responses);
    }

    @Override
    public Result<CategoryLevelResponse> getCategoryLevelById(long id) {
        LOG.info("Get category level by id in service...");
        CategoryLevel categoryLevel = categoryLevelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CategoryLevel not found with ID: " + id));
        return Result.get(CategoryLevelMapper.INSTANT.toCategoryLevelResponse(categoryLevel));
    }

    @Override
    public Result<CategoryLevelResponse> updateCategoryLevelById(long id, CategoryLevelRequest categoryLevelRequest) {
        LOG.info("Find category level by id in service...");
        CategoryLevel categoryLevel = categoryLevelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unable to get CategoryLevel ID: " + id));
        try {
            LOG.info("Update category level by id in service is SUCCESS!");
            categoryLevelRepository.save(CategoryLevelMapper.INSTANT.updateCategoryLevelFromRequest(categoryLevelRequest, categoryLevel));
            return Result.update();
        } catch (Exception ex) {
            LOG.error("Update category level by id in service is FAILED!");
            return Result.serverError("Update category level by id in service is FAILED!");
        }
    }

    @Override
    public Result<CategoryLevelResponse> deleteCategoryLevelById(long id) {
        LOG.info("Find category level by id in service...");
        CategoryLevel categoryLevel = categoryLevelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unable to get CategoryLevel ID: " + id));
        try {
            LOG.info("Delete category level by id in service is SUCCESS!");
            categoryLevelRepository.delete(categoryLevel);
            return Result.delete();
        } catch (Exception ex) {
            LOG.info("Delete category level by id in service is FAILED!");
            return Result.serverError("Delete category level by id in service is FAILED!");
        }
    }
}
