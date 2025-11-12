package com.lumilingua.crms.enums;

import lombok.Getter;

@Getter
public enum StatusEnum {
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE");


    private final String label;

    StatusEnum(String label) {
        this.label = label;
    }
}
