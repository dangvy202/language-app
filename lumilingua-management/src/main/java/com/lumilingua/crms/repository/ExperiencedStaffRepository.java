package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.ExperiencedStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExperiencedStaffRepository extends JpaRepository<ExperiencedStaff, Long> {
    List<ExperiencedStaff> findExperiencedStaffByIdInformationStaff(Long idInformationStaff);


    @Query("SELECT e FROM ExperiencedStaff e WHERE e.idInformationStaff = :idInformationStaff")
    Optional<ExperiencedStaff> findByIdInformationStaff(Long idInformationStaff);
}
