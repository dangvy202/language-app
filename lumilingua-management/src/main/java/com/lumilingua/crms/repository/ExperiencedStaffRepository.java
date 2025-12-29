package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.ExperiencedStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperiencedStaffRepository extends JpaRepository<ExperiencedStaff, Long> {
}
