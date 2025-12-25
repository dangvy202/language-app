package com.lumilingua.crms.exception.handle;

public class InsufficientBalanceException extends RuntimeException{
    public InsufficientBalanceException(String msg) {
        super(msg);
    }
}
