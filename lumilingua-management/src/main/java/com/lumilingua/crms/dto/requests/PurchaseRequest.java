package com.lumilingua.crms.dto.requests;

import com.lumilingua.crms.enums.AmountEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PurchaseRequest {
    private String walletId;
    private long packageCategoryId;
    private AmountEnum amtType;
}
