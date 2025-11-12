package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.VoucherRequest;
import com.lumilingua.crms.dto.responses.VoucherResponse;

import java.util.List;

public interface VoucherService {
//  Admin
    Result<VoucherResponse> createVoucher(VoucherRequest request);
    Result<VoucherResponse> updateVoucher(int id, VoucherRequest request);
    Result<List<VoucherResponse>> getAllVoucher();
    Result<VoucherResponse> getVoucherById(int id);
    Result<VoucherResponse> deleteVoucherById(int id);
}
