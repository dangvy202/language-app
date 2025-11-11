package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;


    @Override
    public Result<UserResponse> registerAccountByCustomer(UserRequest userRequest) {
        return null;
    }
}
