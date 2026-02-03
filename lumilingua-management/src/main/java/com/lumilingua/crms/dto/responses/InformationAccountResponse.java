package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InformationAccountResponse {
    private int idUser;
    private String phone;
    private String email;
}
