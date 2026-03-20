package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.FeatureAppRequest;
import com.lumilingua.crms.dto.responses.FeatureAppResponse;
import com.lumilingua.crms.service.FeatureAppService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/feature-app")
public class FeatureAppController {
    private static final Logger LOG = LoggerFactory.getLogger(FeatureAppController.class);

    private final FeatureAppService service;

    @GetMapping
    public ResponseEntity<Result<List<FeatureAppResponse>>> getAllFeatureApp() {
        LOG.info("Call api get all feature app '%s' by controller".formatted("/api/v1/feature-app"));
        Result<List<FeatureAppResponse>> results = service.getAllFeatureApp();
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Result<FeatureAppResponse>> addFeatureApp(@RequestBody FeatureAppRequest request) {
        LOG.info("Call api add feature app '%s' by controller".formatted("/api/v1/feature-app"));
        Result<FeatureAppResponse> result = service.addFeatureApp(request);
        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/id")
    public ResponseEntity<Result<FeatureAppResponse>> getVoucherById(@RequestParam("id") long id) {
        LOG.info("Get feature app by id in controller by api '%s'".formatted("/api/v1/feature-app/id?id='%s'".formatted(id)));
        Result<FeatureAppResponse> result = service.getFeatureAppById(id);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
