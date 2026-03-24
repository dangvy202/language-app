package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.SkillRequest;
import com.lumilingua.crms.dto.responses.SkillResponse;
import com.lumilingua.crms.dto.responses.SupportFAQResponse;
import com.lumilingua.crms.entity.Skills;
import com.lumilingua.crms.mapper.SkillMapper;
import com.lumilingua.crms.repository.SkillRepository;
import com.lumilingua.crms.service.SkillsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillsServiceImpl implements SkillsService {
    private static final Logger LOG = LoggerFactory.getLogger(SkillsServiceImpl.class);


    private final SkillRepository skillRepository;

    @Override
    public Result<SkillResponse> createSkill(SkillRequest request) {
        LOG.info("Create skill in service...");

        try {
            Skills skill = skillRepository.save(SkillMapper.INSTANT.toSkillEntity(request));
            SkillResponse response = SkillMapper.INSTANT.toSkillResponse(skill);
            LOG.info("Create Skill is SUCCESS!");
            return Result.create(response);
        } catch (Exception e) {
            String msg = "Unable to create Skill!";
            LOG.error(msg);
            return Result.serverError(msg);
        }
    }

    @Override
    public Result<List<SkillResponse>> getAllSkill() {
        LOG.info("Get all skill in service...");
        List<SkillResponse> skills = skillRepository.findAll().stream().map(SkillMapper.INSTANT::toSkillResponse).toList();
        return Result.getAll(skills);
    }
}
