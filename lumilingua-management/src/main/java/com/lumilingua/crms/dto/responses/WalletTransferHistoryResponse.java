package com.lumilingua.crms.dto.responses;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
public class WalletTransferHistoryResponse {
    private String fundTransferWalletId;
    private String receiveWalletId;
    private BigDecimal balanceTransfer;
    private String description;
    private String amountType;
}
