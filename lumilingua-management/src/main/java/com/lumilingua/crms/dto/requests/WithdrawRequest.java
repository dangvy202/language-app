package com.lumilingua.crms.dto.requests;

import com.lumilingua.crms.enums.WithdrawStatusEnum;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WithdrawRequest {
    private long idWithdraw;
    private BigDecimal amtWithdraw;
    private WithdrawStatusEnum status;
    private String reason;
    private String evidencePath;
    private boolean isEvidence;
    private String transactionCode;
    private String email;
    private long idUser;
}
