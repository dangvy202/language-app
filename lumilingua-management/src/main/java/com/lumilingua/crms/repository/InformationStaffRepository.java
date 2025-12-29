package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.InformationStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InformationStaffRepository extends JpaRepository<InformationStaff, Long> {
}
