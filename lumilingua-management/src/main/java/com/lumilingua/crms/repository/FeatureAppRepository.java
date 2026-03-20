package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.FeatureApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureAppRepository extends JpaRepository<FeatureApp, Long> {
}
