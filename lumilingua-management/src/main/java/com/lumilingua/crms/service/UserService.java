package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.AuthenticationRequest;
import com.lumilingua.crms.dto.requests.RefreshTokenRequest;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.dto.responses.InformationAccountResponse;
import com.lumilingua.crms.dto.responses.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
//  User register
    Result<UserResponse> registerAccountByCustomer(UserRequest userRequest);
    Result<AuthenticationResponse> login(AuthenticationRequest request);
    Result<AuthenticationResponse> refreshToken(RefreshTokenRequest request);
    Result<InformationAccountResponse> getInformationAccountByEmail(String email);
    Result<UserResponse> editImageAccount(MultipartFile imgFile, long idUser);
    Result<InformationAccountResponse> getInformationAccountById(long id);
}
