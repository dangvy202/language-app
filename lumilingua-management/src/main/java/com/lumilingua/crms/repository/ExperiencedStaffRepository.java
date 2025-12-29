package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.ExperiencedStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperiencedStaffRepository extends JpaRepository<ExperiencedStaff, Long> {
    List<ExperiencedStaff> findExperiencedStaffByIdInformationStaff(Long idInformationStaff);
}
