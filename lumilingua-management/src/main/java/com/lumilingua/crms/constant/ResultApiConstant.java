package com.lumilingua.crms.constant;

public class ResultApiConstant {
    
    public static class StatusCode {
        public static final int OK = 200;
        public static final int CREATED = 201;
        public static final int NO_CONTENT = 204;
        public static final int BAD_REQUEST = 400;
        public static final int UNAUTHORIZED = 401;
        public static final int FORBIDDEN = 403;
        public static final int NOT_FOUND = 404;
        public static final int CONFLICT = 409;
        public static final int UNPROCESSABLE_ENTITY = 422;
        public static final int INTERNAL_SERVER_ERROR = 500;
    }
    
    public static class MessageCode {
        public static final String SUCCESS = "Success";
        public static final String CREATED_SUCCESS = "Resource created successfully";
        public static final String NO_CONTENT_MESSAGE = "No content available";
        public static final String BAD_REQUEST_MESSAGE = "Bad request";
        public static final String UNAUTHORIZED_MESSAGE = "Unauthorized access";
        public static final String FORBIDDEN_MESSAGE = "Forbidden";
        public static final String NOT_FOUND_MESSAGE = "Resource not found";
        public static final String CONFLICT_MESSAGE = "Conflict detected";
        public static final String UNPROCESSABLE_ENTITY_MESSAGE = "Validation error";
        public static final String INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error";
    }
}
