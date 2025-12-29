package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.ExperiencedStaffRequest;
import com.lumilingua.crms.dto.responses.ExperiencedStaffResponse;
import com.lumilingua.crms.entity.ExperiencedStaff;
import com.lumilingua.crms.mapper.ExperiencedStaffMapper;
import com.lumilingua.crms.repository.ExperiencedStaffRepository;
import com.lumilingua.crms.service.ExperiencedStaffService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperiencedStaffServiceImpl implements ExperiencedStaffService {
    private static final Logger LOG = LoggerFactory.getLogger(ExperiencedStaffServiceImpl.class);

    private final ExperiencedStaffRepository experiencedStaffRepository;

}
