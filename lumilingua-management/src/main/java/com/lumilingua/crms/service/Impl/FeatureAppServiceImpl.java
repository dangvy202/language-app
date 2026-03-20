package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.FeatureAppRequest;
import com.lumilingua.crms.dto.responses.FeatureAppResponse;
import com.lumilingua.crms.entity.FeatureApp;
import com.lumilingua.crms.mapper.FeatureAppMapper;
import com.lumilingua.crms.repository.FeatureAppRepository;
import com.lumilingua.crms.service.FeatureAppService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureAppServiceImpl implements FeatureAppService {
    private static final Logger LOG = LoggerFactory.getLogger(FeatureAppServiceImpl.class);

    private final FeatureAppRepository featureAppRepository;

    @Override
    public Result<List<FeatureAppResponse>> getAllFeatureApp() {
        LOG.info("Get all feature app in service...");
        List<FeatureApp> featureApps = featureAppRepository.findAll();
        List<FeatureAppResponse> responses = featureApps.stream().map(FeatureAppMapper.INSTANT::toFeatureAppResponse).toList();
        return Result.getAll(responses);
    }

    @Override
    public Result<FeatureAppResponse> addFeatureApp(FeatureAppRequest request) {
        LOG.info("Add feature app in service...");

        try {
            FeatureApp featureApp = featureAppRepository.save(FeatureAppMapper.INSTANT.toFeatureAppEntity(request));
            FeatureAppResponse response = FeatureAppMapper.INSTANT.toFeatureAppResponse(featureApp);
            LOG.info("Create Feature App is SUCCESS!");
            return Result.create(response);
        } catch (Exception e) {
            String msg = "Unable to create feature app!";
            LOG.error(msg);
            return Result.serverError(msg);
        }
    }

    @Override
    public Result<FeatureAppResponse> getFeatureAppById(long id) {
        LOG.info("Get feature app by id '%s' in service...".formatted(id));
        try {
            FeatureAppResponse featureApp = featureAppRepository.findById(id)
                    .map(FeatureAppMapper.INSTANT::toFeatureAppResponse)
                    .orElseThrow(() -> new RuntimeException("Unable to get feature app by id '%s'".formatted(id)));
            return Result.get(featureApp);
        } catch (Exception ex) {
            String msg = "Unable to get feature app by id '%s'".formatted(id);
            LOG.error(msg);
            return Result.badRequestError(msg);
        }
    }
}
