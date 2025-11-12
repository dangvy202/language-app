package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

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

    @Column(name = "id_active")
    private boolean active;

    @Column(name = "id_user")
    private long idUser;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
