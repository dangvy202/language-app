package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.Withdraw;
import com.lumilingua.crms.enums.WithdrawStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface WithdrawRepository extends JpaRepository<Withdraw, Long> {
    @Query("SELECT COALESCE(SUM(w.amtWithdraw), 0.0) " +
            "FROM Withdraw w " +
            "WHERE w.idUser = :idUser " +
            "AND w.status = :status")
    BigDecimal findTotalWithdrawByStatusAndIdUser(long idUser, WithdrawStatusEnum status);
}
