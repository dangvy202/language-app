package com.lumilingua.crms.enums;

import lombok.Getter;

@Getter
public enum WithdrawStatusEnum {
    PENDING,
    PROCESSING,
    APPROVED,
    REJECTED,
    COMPLETED,
    FAILED
}
