package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.CategoryLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryLevelRepository extends JpaRepository<CategoryLevel, Long> {
}
