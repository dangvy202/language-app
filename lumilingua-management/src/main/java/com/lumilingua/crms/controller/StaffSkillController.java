package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.StaffSkillRequest;
import com.lumilingua.crms.dto.responses.StaffSkillResponse;
import com.lumilingua.crms.service.StaffSkillService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/staff-skill")
public class StaffSkillController {
    private static final Logger LOG = LoggerFactory.getLogger(StaffSkillController.class);

    private final StaffSkillService staffSkillService;

    @PostMapping
    public ResponseEntity<Result<List<StaffSkillResponse>>> createSkillOfStaff(@RequestBody List<StaffSkillRequest> request) {
        LOG.info("Call api create skill of staff by controller: '%s'".formatted("/api/v1/staff-skill"));
        Result<List<StaffSkillResponse>> result = staffSkillService.createSkillOfStaff(request);

        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
