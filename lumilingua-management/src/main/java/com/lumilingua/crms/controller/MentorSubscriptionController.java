package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.MentorSubscriptionRequest;
import com.lumilingua.crms.dto.responses.MentorSubscriptionResponse;
import com.lumilingua.crms.service.MentorSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mentor-subscription")
public class MentorSubscriptionController {
    private static final Logger LOG = LoggerFactory.getLogger(MentorSubscriptionController.class);

    private final MentorSubscriptionService service;

    @GetMapping
    public ResponseEntity<Result<MentorSubscriptionResponse>> getContractByIdUserAndIdStaff(@RequestBody MentorSubscriptionRequest request) {
        LOG.info("Call api get contract by api '%s'".formatted("/api/v1/mentor-subscription"));
        Result<MentorSubscriptionResponse> result = service.getContractByUserIdAndStaffIf(request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Result<MentorSubscriptionResponse>> mentorSubscription(@RequestBody MentorSubscriptionRequest request) {
        LOG.info("Call api mentor subscription by api '%s'".formatted("/api/v1/mentor-subscription"));
        Result<MentorSubscriptionResponse> result = service.pickMentor(request);
        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/negotiate")
    public ResponseEntity<Result<MentorSubscriptionResponse>> negotiate(@RequestBody MentorSubscriptionRequest request) {
        LOG.info("Call api mentor subscription by api '%s'".formatted("/api/v1/mentor-subscription/negotiate"));
        Result<MentorSubscriptionResponse> result = service.negotiate(request);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
