package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.FeatureAppRequest;
import com.lumilingua.crms.dto.responses.FeatureAppResponse;

import java.util.List;

public interface FeatureAppService {
    Result<List<FeatureAppResponse>> getAllFeatureApp();
    Result<FeatureAppResponse> addFeatureApp(FeatureAppRequest request);
    Result<FeatureAppResponse> getFeatureAppById(long id);
}
