package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.Skills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skills, Long> {
}
