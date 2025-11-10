package com.lumilingua.crms.enums;

public enum RoleEnum {
    USER("USER"),
    TEACHER("TEACHER"),
    STAFF("STAFF"),
    ADMIN("ADMIN");

    private final String staff;

    RoleEnum(String staff) {
        this.staff = staff;
    }
}
