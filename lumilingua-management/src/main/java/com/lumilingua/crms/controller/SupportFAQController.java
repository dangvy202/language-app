package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.SupportFAQRequest;
import com.lumilingua.crms.dto.responses.SupportFAQResponse;
import com.lumilingua.crms.service.SupportFAQService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/support-faq")
public class SupportFAQController {
    private static final Logger LOG = LoggerFactory.getLogger(SupportFAQController.class);

    private final SupportFAQService service;

    @GetMapping
    public ResponseEntity<Result<List<SupportFAQResponse>>> getAllSupportFAQ() {
        LOG.info("Call api get all support faq '%s' by controller".formatted("/api/v1/support-faq"));
        Result<List<SupportFAQResponse>> results = service.getAllSupportFAQ();
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Result<SupportFAQResponse>> addSupportFAQ(@RequestBody SupportFAQRequest request) {
        LOG.info("Call api add support faq '%s' by controller".formatted("/api/v1/support-faq"));
        Result<SupportFAQResponse> result = service.addSupportFAQ(request);
        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
