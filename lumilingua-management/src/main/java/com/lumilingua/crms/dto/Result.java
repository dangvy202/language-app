package com.lumilingua.crms.dto;

import com.lumilingua.crms.constant.ResultApiConstant;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Result<T> {
    public int code;
    public String message;
    public T data;

    public static <T> Result<T> serverError() {
        return new Result<>(ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR, ResultApiConstant.MessageCode.INTERNAL_SERVER_ERROR_MESSAGE, null);
    }

    public static <T> Result<T> create(T data) {
        return new Result<>(ResultApiConstant.StatusCode.CREATED, ResultApiConstant.MessageCode.CREATED_SUCCESS, data);
    }

    public static <T> Result<List<T>> getAll(List<T> data) {
        return new Result<>(ResultApiConstant.StatusCode.OK, ResultApiConstant.MessageCode.SUCCESS, data);
    }

    public static <T> Result<T> get(T data) {
        return new Result<>(ResultApiConstant.StatusCode.OK, ResultApiConstant.MessageCode.SUCCESS, data);
    }
}
