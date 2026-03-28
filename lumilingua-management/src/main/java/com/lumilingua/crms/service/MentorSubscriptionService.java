package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.MentorSubscriptionRequest;
import com.lumilingua.crms.dto.responses.MentorSubscriptionResponse;

import java.util.List;

public interface MentorSubscriptionService {
    Result<MentorSubscriptionResponse> pickMentor(MentorSubscriptionRequest request);
    Result<MentorSubscriptionResponse> negotiate(MentorSubscriptionRequest request);
    Result<MentorSubscriptionResponse> getContractByUserIdAndStaffIf(MentorSubscriptionRequest request);
    Result<List<MentorSubscriptionResponse>> getContractByIdUser(long id);
    Result<List<MentorSubscriptionResponse>> getContractByIdStaff(long id);
    Result<MentorSubscriptionResponse> paidContract(MentorSubscriptionRequest request);
}
