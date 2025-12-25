package com.lumilingua.crms.enums;

import lombok.Getter;

@Getter
public enum StatusEnum {
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE"),
    DELETE("DELETE"),//History
    KEEP("KEEP");//History



    private final String label;

    StatusEnum(String label) {
        this.label = label;
    }
}
