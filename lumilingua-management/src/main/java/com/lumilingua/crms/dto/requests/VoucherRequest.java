package com.lumilingua.crms.dto.requests;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoucherRequest {
    private int discount;
    private String description;
    private String expiredVoucher;
}
