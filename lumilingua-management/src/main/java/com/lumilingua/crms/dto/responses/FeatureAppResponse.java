package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FeatureAppResponse {
    private long idFeatureApp;
    private String featureName;
    private String description;
}
