package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupportFAQResponse {
    private long idFeatureApp;
    private String question;
    private String answer;
    private FeatureAppResponse featureAppResponse;
}
