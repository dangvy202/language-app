package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.enums.WithdrawStatusEnum;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class WithdrawResponse {
    private BigDecimal amtWithdraw;
    private WithdrawStatusEnum status;
    private String reason;
    private String evidencePath;
    private String transactionCode;
    private UserResponse user;
    private WalletResponse wallet;
    private Date createdAt;
    private Date updatedAt;
}
