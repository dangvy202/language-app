package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.enums.StatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InformationAccountResponse {
    private int idUser;
    private String phone;
    private String email;
    private String avatar;
    private StatusEnum status;
}
