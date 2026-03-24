package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.StaffSkillRequest;
import com.lumilingua.crms.dto.responses.StaffSkillResponse;

import java.util.List;

public interface StaffSkillService {
    Result<List<StaffSkillResponse>> createSkillOfStaff(List<StaffSkillRequest> request);
}
