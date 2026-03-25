package com.lumilingua.crms.repository;

import com.lumilingua.crms.dto.responses.ExperiencedStaffResponse;
import com.lumilingua.crms.dto.responses.StaffSkillResponse;
import com.lumilingua.crms.entity.StaffSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffSkillRepository extends JpaRepository<StaffSkill, Long> {

    List<StaffSkill> findStaffSkillByidInformationStaff(Long idInformation);
}
