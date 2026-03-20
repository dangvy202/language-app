package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.SupportFAQRequest;
import com.lumilingua.crms.dto.responses.FeatureAppResponse;
import com.lumilingua.crms.dto.responses.SupportFAQResponse;
import com.lumilingua.crms.entity.FeatureApp;
import com.lumilingua.crms.entity.SupportFAQ;
import com.lumilingua.crms.mapper.FeatureAppMapper;
import com.lumilingua.crms.mapper.SupportFAQMapper;
import com.lumilingua.crms.repository.SupportFAQRepository;
import com.lumilingua.crms.service.FeatureAppService;
import com.lumilingua.crms.service.SupportFAQService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportFAQServiceImpl implements SupportFAQService {
    private static final Logger LOG = LoggerFactory.getLogger(SupportFAQServiceImpl.class);

    private final SupportFAQRepository supportFAQRepository;
    private final FeatureAppService featureAppService;

    @Override
    public Result<List<SupportFAQResponse>> getAllSupportFAQ() {
        LOG.info("Get all support faq in service...");
        List<SupportFAQResponse> supportFAQs = supportFAQRepository.findAllWithFeatureDetails();
        return Result.getAll(supportFAQs);
    }

    @Override
    public Result<SupportFAQResponse> addSupportFAQ(SupportFAQRequest request) {
        LOG.info("Add feature app in service...");

        try {
            SupportFAQ supportFAQ = supportFAQRepository.save(SupportFAQMapper.INSTANT.toSupportFAQ(request));
            SupportFAQResponse response = SupportFAQMapper.INSTANT.toSupportFAQResponse(supportFAQ);
            LOG.info("Create Support FAQ is SUCCESS!");
            return Result.create(response);
        } catch (Exception e) {
            String msg = "Unable to create Support FAQ!";
            LOG.error(msg);
            return Result.serverError(msg);
        }
    }
}
