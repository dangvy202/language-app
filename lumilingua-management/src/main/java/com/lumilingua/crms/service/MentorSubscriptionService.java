package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.MentorSubscriptionRequest;
import com.lumilingua.crms.dto.responses.MentorSubscriptionResponse;

public interface MentorSubscriptionService {
    Result<MentorSubscriptionResponse> pickMentor(MentorSubscriptionRequest request);
    Result<MentorSubscriptionResponse> negotiate(MentorSubscriptionRequest request);
    Result<MentorSubscriptionResponse> getContractByUserIdAndStaffIf(MentorSubscriptionRequest request);
}
