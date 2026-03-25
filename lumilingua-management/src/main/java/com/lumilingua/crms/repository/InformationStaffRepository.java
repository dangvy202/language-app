package com.lumilingua.crms.repository;

import com.lumilingua.crms.dto.responses.InformationStaffResponse;
import com.lumilingua.crms.entity.InformationStaff;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InformationStaffRepository extends JpaRepository<InformationStaff, Long> {
    @Query("""
        SELECT i
        FROM InformationStaff i
        WHERE i.idUser = :idUser
        """
    )
    Optional<InformationStaff> findByIdUser(@Param("idUser") long idUser);
    @Query("""
        SELECT i
        FROM InformationStaff i
        WHERE i.idUser = :idUser
        """
    )
    List<InformationStaff> getListInformationByIdUser(@Param("idUser") long idUser);
}
