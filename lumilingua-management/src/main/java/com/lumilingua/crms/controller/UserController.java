package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.AuthenticationRequest;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.service.UserService;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Result<UserResponse>> userRegisterAccount(@RequestBody UserRequest userRequest) {
        LOG.info("User register account in controller by api '%s'".formatted("/api/v1/user"));
        Result<UserResponse> result = userService.registerAccountByCustomer(userRequest);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

//    @PostMapping("/authentication/cache/login")
//    public ResponseEntity<Object> getTokenWhenLoginSuccess(@RequestHeader("key-cache") @Nullable String keyRedis) {
//        var response = userService.getTokenInRedis(keyRedis);
//
//        if(response.equals(UserMessage.FAIL) || response.getMessage().equals(UserMessage.EXPIRED_USER) || keyRedis.isEmpty()) {
//            return new ResponseEntity<>(response,HttpStatus.FORBIDDEN);
//        }
//        return new ResponseEntity<>(response,HttpStatus.OK);
//    }

    @PostMapping("/login")
    public ResponseEntity<Result<AuthenticationResponse>> login(@RequestBody AuthenticationRequest request) {
        var result = userService.login(request);

        if(result.code == ResultApiConstant.StatusCode.FORBIDDEN) {
            return new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
        }

        if(result.code == ResultApiConstant.StatusCode.UNAUTHORIZED){
            return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(result, HttpStatus.ACCEPTED);
    }
}
