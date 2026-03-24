package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.SkillRequest;
import com.lumilingua.crms.dto.responses.SkillResponse;

import java.util.List;

public interface SkillsService {
    Result<SkillResponse> createSkill(SkillRequest request);
    Result<List<SkillResponse>> getAllSkill();
}
