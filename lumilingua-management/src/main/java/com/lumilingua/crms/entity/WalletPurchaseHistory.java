package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_wallet_purchase_history")
public class WalletPurchaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_wallet_purchase_history")
    private long idWalletPurchaseHistory;

    @Column(name = "description")
    private String description;

    @Column(name = "wallet_id")
    private String walletId;

    @Column(name = "amount_type")
    private String amountType;

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    @Column(name = "status")
    private String status;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
