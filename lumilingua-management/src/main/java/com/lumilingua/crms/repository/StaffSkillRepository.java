package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.StaffSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffSkillRepository extends JpaRepository<StaffSkill, Long> {
}
