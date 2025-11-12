package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoucherResponse {
    private long idVoucher;
    private int discount;
    private String description;
    private String expiredVoucher;
}
