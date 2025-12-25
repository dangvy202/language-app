package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.WalletTransferHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletTransferHistoryRepository extends JpaRepository<WalletTransferHistory, Long> {
}

