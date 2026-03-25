package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.InformationStaffRequest;
import com.lumilingua.crms.dto.responses.InformationStaffResponse;

import java.util.List;

public interface InformationStaffService {
//  user
    Result<InformationStaffResponse> createInformationStaff(InformationStaffRequest request);
    Result<InformationStaffResponse> deleteInformationStaff(InformationStaffRequest request);
    Result<List<InformationStaffResponse>> getInformationStaffByEmail(String email);
    Result<InformationStaffResponse> editInformationStaffByEmail(InformationStaffRequest request);
    Result<List<InformationStaffResponse>> getAllStaffTutor();
//  admin
    Result<InformationStaffResponse> activeContractStaff(long id);
    Result<InformationStaffResponse> rejectContractStaff(long id);
}
