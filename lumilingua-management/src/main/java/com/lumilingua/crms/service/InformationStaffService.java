package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.InformationStaffRequest;
import com.lumilingua.crms.dto.responses.InformationStaffResponse;

public interface InformationStaffService {
//  user
    Result<InformationStaffResponse> createInformationStaff(InformationStaffRequest request);
//  admin
    Result<InformationStaffResponse> activeContractStaff(long id);
}
