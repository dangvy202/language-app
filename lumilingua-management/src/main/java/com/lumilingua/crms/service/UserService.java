package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.UserResponse;

public interface UserService {
    Result<UserResponse> registerAccountByCustomer(UserRequest userRequest);
}
