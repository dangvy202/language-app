package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.StaffSkillRequest;
import com.lumilingua.crms.dto.responses.StaffSkillResponse;
import com.lumilingua.crms.dto.responses.SupportFAQResponse;
import com.lumilingua.crms.entity.InformationStaff;
import com.lumilingua.crms.entity.Skills;
import com.lumilingua.crms.entity.StaffSkill;
import com.lumilingua.crms.entity.SupportFAQ;
import com.lumilingua.crms.mapper.StaffSkillMapper;
import com.lumilingua.crms.mapper.SupportFAQMapper;
import com.lumilingua.crms.repository.InformationStaffRepository;
import com.lumilingua.crms.repository.SkillRepository;
import com.lumilingua.crms.repository.StaffSkillRepository;
import com.lumilingua.crms.service.StaffSkillService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffSkillServiceImpl implements StaffSkillService {
    private static final Logger LOG = LoggerFactory.getLogger(StaffSkillServiceImpl.class);

    private final StaffSkillRepository staffSkillRepository;
    private final SkillRepository skillRepository;

    @Override
    public Result<List<StaffSkillResponse>> createSkillOfStaff(List<StaffSkillRequest> request) {
        LOG.info("Create staff skill in service...");
        List<StaffSkillResponse> response = new ArrayList<>();
        List<Long> skillIds = request.stream().map(StaffSkillRequest::getIdSkill).toList();
        List<Skills> skills = skillRepository.findAllById(skillIds);
        if (skills.size() != skillIds.size()) {
            throw new EntityNotFoundException("Some skills do NOT exist");
        }
        request.forEach(res -> {
            StaffSkill staffSkill = staffSkillRepository.save(StaffSkillMapper.INSTANT.toStaffSkillEntity(res));
            response.add(StaffSkillMapper.INSTANT.toStaffSkillResponse(staffSkill));
        });
        LOG.info("Create Staff Skill is SUCCESS!");
        return Result.create(response);
    }
}
