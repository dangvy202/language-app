package com.lumilingua.crms.controller;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @PostMapping
    public ResponseEntity<Result<UserResponse>> userRegisterAccount(@RequestBody UserRequest userRequest) {
        LOG.info("User register account in controller by api '%s'".formatted("/api/v1/user"));
        userService.registerAccountByCustomer(userRequest);
        return null;
    }
}
