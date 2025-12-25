package com.lumilingua.crms.dto.requests;

import com.lumilingua.crms.enums.AmountEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class TransferRequest {
    private String fundWalletId;
    private String receiveWalletId;
    private BigDecimal amount;
    private AmountEnum amtType;
}
