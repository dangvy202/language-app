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
    public String notification;
    public T data;

    public static <T> Result<T> serverError(String notification) {
        return new Result<>(ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR, ResultApiConstant.MessageCode.INTERNAL_SERVER_ERROR_MESSAGE, notification, null);
    }

    public static <T> Result<T> badRequestError(String notification) {
        return new Result<>(ResultApiConstant.StatusCode.BAD_REQUEST, ResultApiConstant.MessageCode.BAD_REQUEST_MESSAGE,notification, null);
    }

    public static <T> Result<T> create(T data) {
        return new Result<>(ResultApiConstant.StatusCode.CREATED, ResultApiConstant.MessageCode.CREATED_SUCCESS, null, data);
    }

    public static <T> Result<T> update() {
        return new Result<>(ResultApiConstant.StatusCode.NO_CONTENT, ResultApiConstant.MessageCode.NO_CONTENT_MESSAGE, null, null);
    }

    public static <T> Result<T> delete() {
        return new Result<>(ResultApiConstant.StatusCode.NO_CONTENT, ResultApiConstant.MessageCode.NO_CONTENT_MESSAGE, null, null);
    }

    public static <T> Result<List<T>> getAll(List<T> data) {
        return new Result<>(ResultApiConstant.StatusCode.OK, ResultApiConstant.MessageCode.SUCCESS, null, data);
    }

    public static <T> Result<T> get(T data) {
        return new Result<>(ResultApiConstant.StatusCode.OK, ResultApiConstant.MessageCode.SUCCESS, null, data);
    }
}
