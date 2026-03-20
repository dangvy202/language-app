package com.lumilingua.crms.repository;

import com.lumilingua.crms.dto.responses.SupportFAQResponse;
import com.lumilingua.crms.entity.SupportFAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportFAQRepository extends JpaRepository<SupportFAQ, Long> {
    @Query("""
        SELECT new com.lumilingua.crms.dto.responses.SupportFAQResponse(
            s.idFeatureApp,
            s.question,
            s.answer,
            new com.lumilingua.crms.dto.responses.FeatureAppResponse(
                f.idFeatureApp,
                f.featureName,
                f.description
            )
        )
        FROM SupportFAQ s
        LEFT JOIN FeatureApp f ON s.idFeatureApp = f.idFeatureApp
        ORDER BY s.createdAt DESC
    """)
    List<SupportFAQResponse> findAllWithFeatureDetails();
}
