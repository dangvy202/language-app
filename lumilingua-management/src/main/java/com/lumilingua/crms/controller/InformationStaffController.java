package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.InformationStaffRequest;
import com.lumilingua.crms.dto.responses.InformationStaffResponse;
import com.lumilingua.crms.service.InformationStaffService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/information-staff")
public class InformationStaffController {
    private static final Logger LOG = LoggerFactory.getLogger(InformationStaffController.class);

    private final InformationStaffService service;

    @PostMapping
    public ResponseEntity<Result<InformationStaffResponse>> createInformationStaff(@RequestBody InformationStaffRequest request) {
        LOG.info("Call api create information staff by api '%s'".formatted("/api/v1/information-staff"));
        Result<InformationStaffResponse> result = service.createInformationStaff(request);
        if(result.code == ResultApiConstant.StatusCode.CREATED) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/active")
    public ResponseEntity<Result<InformationStaffResponse>> activeInformationStaff(@RequestParam("id") long id) {
        LOG.info("Call api active information staff by api '%s'".formatted("/api/v1/information-staff/active?id='%s'".formatted(id)));
        Result<InformationStaffResponse> result = service.activeContractStaff(id);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }
}
