package com.lumilingua.crms.repository;

import com.lumilingua.crms.dto.responses.SkillResponse;
import com.lumilingua.crms.dto.responses.StaffSkillResponse;
import com.lumilingua.crms.entity.Skills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skills, Long> {
    @Query("SELECT s FROM Skills s WHERE s.idSkill IN :idSkill")
    List<Skills> findStaffSkillByIdInformation(List<Long> idSkill);
}
