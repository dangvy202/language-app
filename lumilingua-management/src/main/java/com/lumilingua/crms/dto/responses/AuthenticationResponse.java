package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.enums.GenderEnum;
import com.lumilingua.crms.enums.RoleEnum;
import com.lumilingua.crms.enums.StatusEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponse {
    private String token;
    private long expired;
    private String refreshToken;
    private InformationResponse information;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class InformationResponse {
        private long idUser;
        private String username;
        private String email;
        private StatusEnum status;
        private String phone;
        private GenderEnum gender;
        private RoleEnum role;
        private String avatar;
        private String walletId;
    }
}
