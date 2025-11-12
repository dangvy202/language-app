package com.lumilingua.crms.dto.responses;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class WalletResponse {
    private String walletId;
    private BigDecimal amountLearn;
    private BigDecimal amountTopUp;
    private boolean active;
}
