package com.lumilingua.crms.entity;

import com.lumilingua.crms.enums.WithdrawStatusEnum;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_withdraw")
public class Withdraw {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_withdraw")
    private long idWithdraw;

    @Column(name = "amount_withdraw")
    private BigDecimal amtWithdraw;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private WithdrawStatusEnum status;

    @Column(name = "reason")
    private String reason;

    @Column(name = "evidence_path")
    private String evidencePath;

    @Column(name = "transaction_code", unique = true, length = 50)
    private String transactionCode;

    @Column(name = "idUser")
    private long idUser;

    @Column(name = "wallet_id")
    private String walletId;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
