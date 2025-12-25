package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.WalletPurchaseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletPurchaseHistoryRepository extends JpaRepository<WalletPurchaseHistory, Long> {
}
