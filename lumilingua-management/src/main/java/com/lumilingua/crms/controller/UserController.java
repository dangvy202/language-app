package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.AuthenticationRequest;
import com.lumilingua.crms.dto.requests.RefreshTokenRequest;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.dto.responses.InformationAccountResponse;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.service.UserService;
 import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@CrossOrigin
public class UserController {
    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @PostMapping(value = "/edit-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<UserResponse>> editImageUserAccount(@PathVariable("id") long idUser, @RequestParam("avatar") MultipartFile image) {
        LOG.info("User register account in controller by api '%s'".formatted("/api/v1/user/edit-image"));
        Result<UserResponse> result = userService.editImageAccount(image, idUser);
        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Result<UserResponse>> userRegisterAccount(@RequestBody UserRequest userRequest) {
        LOG.info("User register account in controller by api '%s'".formatted("/api/v1/user"));
        Result<UserResponse> result = userService.registerAccountByCustomer(userRequest);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

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

    @PostMapping("/refresh")
    public ResponseEntity<Result<AuthenticationResponse>> refresh(@RequestBody RefreshTokenRequest request) {
        var result = userService.refreshToken(request);
        if(result.code != ResultApiConstant.StatusCode.OK) {
            return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Result<InformationAccountResponse>> getInformationAccountByEmail(@PathVariable("email") String email) {
        LOG.info("Call api get information account by email '%s'".formatted("/api/v1/user/'" + email));
        var result = userService.getInformationAccountByEmail(email);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<Result<InformationAccountResponse>> getInformationAccountById(@PathVariable("id") long id) {
        LOG.info("Call api get information account by id '%s'".formatted("/api/v1/user/info/'" + id));
        var result = userService.getInformationAccountById(id);

        if(result.getCode() == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
