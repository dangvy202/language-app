package com.lumilingua.crms.exception;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.exception.handle.InsufficientBalanceException;
import jakarta.persistence.EntityNotFoundException;
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

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Result<?>> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Result.badRequestError(ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Result<?>> handleRunTimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Result.serverError(ex.getMessage()));
    }
}
