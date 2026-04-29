package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.CategoryLevel;
import com.lumilingua.crms.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryLevelRepository extends JpaRepository<CategoryLevel, Long> {
    List<CategoryLevel> findCategoryLevelByStatus(StatusEnum status);
}
