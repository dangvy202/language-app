package com.lumilingua.crms.dto.requests;

import lombok.Data;

@Data
public class SupportFAQRequest {
    private String question;
    private String answer;
    private long idFeatureApp;
}
