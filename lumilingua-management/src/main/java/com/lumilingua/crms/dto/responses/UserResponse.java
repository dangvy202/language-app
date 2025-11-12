package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.enums.GenderEnum;
import com.lumilingua.crms.enums.RoleEnum;
import com.lumilingua.crms.enums.StatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserResponse {
    private long idUser;
    private String username;
    private String password;
    private String tokenAccount;
    private String email;
    private StatusEnum status;
    private String phone;
    private GenderEnum gender;
    private RoleEnum role;
    private String refreshToken;
    private String provider;
    private String providerId;
    private String avatar;
    private LocalDateTime lastLogin;
    private String walletId;
    private int idCategoryLevel;
}
