package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.SupportFAQRequest;
import com.lumilingua.crms.dto.responses.SupportFAQResponse;

import java.util.List;

public interface SupportFAQService {
    Result<List<SupportFAQResponse>> getAllSupportFAQ();
    Result<SupportFAQResponse> addSupportFAQ(SupportFAQRequest request);
}
