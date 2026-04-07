package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.WithdrawRequest;
import com.lumilingua.crms.dto.responses.WithdrawResponse;

import java.math.BigDecimal;
import java.util.List;

public interface WithdrawService {
    // User
    Result<WithdrawResponse> createWithdraw(WithdrawRequest request);
    Result<BigDecimal> getSummaryWithdrawByEmailAndStatus(WithdrawRequest request);
    Result<List<WithdrawResponse>> getAllWithdrawSuccess(WithdrawRequest request);
    Result<List<WithdrawResponse>> getAllWithdrawFail(WithdrawRequest request);
    // Admin
    Result<WithdrawResponse> updateStatusWithdraw(WithdrawRequest request);
    Result<WithdrawResponse> updateEvidenceWithdraw(WithdrawRequest request);
}
