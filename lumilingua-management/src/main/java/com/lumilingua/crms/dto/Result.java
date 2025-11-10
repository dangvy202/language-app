package com.lumilingua.crms.dto;

public class Result<T> {
    private String code;
    private String status;
    private String message;
    private T data;
}
