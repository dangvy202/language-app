package com.lumilingua.crms.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BankRequest {
    private String bankName;
    private String bankBranch;
    private String branchIdentification;
    private String bankHolder;
}
