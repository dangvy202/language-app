package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.AuthenticationRequest;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.dto.responses.UserResponse;

public interface UserService {
//  User register
    Result<UserResponse> registerAccountByCustomer(UserRequest userRequest);
    Result<AuthenticationResponse> login(AuthenticationRequest request);
}
