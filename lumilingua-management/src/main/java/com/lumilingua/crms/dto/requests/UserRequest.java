package com.lumilingua.crms.dto.requests;

import com.lumilingua.crms.enums.GenderEnum;
import com.lumilingua.crms.enums.RoleEnum;
import com.lumilingua.crms.enums.StatusEnum;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
public class UserRequest {
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
    private Date lastLogin;
    private String walletId;
    private int idCategoryLevel;
}
