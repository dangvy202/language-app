package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_wallet_transfer_history")
public class WalletTransferHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_wallet_transfer_history")
    private long idWalletTransferHistory;

    @Column(name = "fund_transfer_wallet_id")
    private String fundTransferWalletId;

    @Column(name = "receive_wallet_id")
    private String receiveWalletId;

    @Column(name = "balance_transfer")
    private BigDecimal balanceTransfer;

    @Column(name = "amount_type")
    private String amountType;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
