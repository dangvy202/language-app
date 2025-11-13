package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_wallet")
public class Wallet {

    @Id
    @Column(name = "wallet_id", updatable = false, nullable = false)
    private String walletId;

    @Column(name = "amount_learn")
    private BigDecimal amountLearn;

    @Column(name = "amount_topup")
    private BigDecimal amountTopUp;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_branch")
    private String bankBranch;

    @Column(name = "bank_identification")
    private String branchIdentification;

    @Column(name = "bank_holder")
    private String bankHolder;

    @Column(name = "is_active")
    private boolean active;

    @Column(name = "expired_voucher")
    private Date expiredVoucher;

    @Column(name = "id_user")
    private long idUser;

    @Column(name = "id_voucher")
    private long idVoucher;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
