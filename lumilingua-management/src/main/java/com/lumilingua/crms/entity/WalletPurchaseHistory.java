package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@Entity
@Table(name = "tbl_wallet_purchase_history")
public class WalletPurchaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_wallet_purchase_history")
    private long idWalletPurchaseHistory;

    @Column(name = "action")
    private String action;

    @Column(name = "description")
    private String description;

    @Column(name = "wallet_id")
    private String walletId;

    @Column(name = "amount_paid")
    private String amountPaid;

    @Column(name = "amount_refund")
    private String amountRefund;

    @Column(name = "status")
    private String status;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
