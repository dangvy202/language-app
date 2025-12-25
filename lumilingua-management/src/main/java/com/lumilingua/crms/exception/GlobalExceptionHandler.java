package com.lumilingua.crms.exception;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.exception.handle.InsufficientBalanceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InstantiationException.class)
    public ResponseEntity<Result<?>> handleInsufficient() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Result.badRequestError("Insufficient balance"));
    }
}
