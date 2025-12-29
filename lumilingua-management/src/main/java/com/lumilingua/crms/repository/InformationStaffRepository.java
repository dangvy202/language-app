package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.InformationStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InformationStaffRepository extends JpaRepository<InformationStaff, Long> {
    Optional<InformationStaff> findInformationStaffByIdUser(long id);
}
