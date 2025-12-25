package com.lumilingua.crms.enums;

import lombok.Getter;

@Getter
public enum PurchaseEnum {
    BUY(""),
    PAID(""),
    REFUND("");
    private final String description;

    PurchaseEnum(String description) {
        this.description = description;
    }
}
