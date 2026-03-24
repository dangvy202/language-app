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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/information-staff")
public class InformationStaffController {
    private static final Logger LOG = LoggerFactory.getLogger(InformationStaffController.class);

    private final InformationStaffService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<InformationStaffResponse>> createInformationStaff(@ModelAttribute InformationStaffRequest request) {
        LOG.info("Call api create information staff by api '%s'".formatted("/api/v1/information-staff"));
        Result<InformationStaffResponse> result = service.createInformationStaff(request);
        if(result.code == ResultApiConstant.StatusCode.CREATED) {
            return new ResponseEntity<>(null, HttpStatus.CREATED);
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

    @PutMapping("/reject")
    public ResponseEntity<Result<InformationStaffResponse>> rejectInformationStaff(@RequestParam("id") long id) {
        LOG.info("Call api active information staff by api '%s'".formatted("/api/v1/information-staff/reject?id='%s'".formatted(id)));
        Result<InformationStaffResponse> result = service.rejectContractStaff(id);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update")
    public ResponseEntity<Result<InformationStaffResponse>> activeInformationStaff(@RequestBody InformationStaffRequest request) {
        LOG.info("Call api active information staff by api '%s'".formatted("/api/v1/information-staff/update"));
        Result<InformationStaffResponse> result = service.editInformationStaffByEmail(request);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }

    @DeleteMapping
    public ResponseEntity<Result<InformationStaffResponse>> deleteInformationStaff(@RequestBody InformationStaffRequest request) {
        LOG.info("Call api delete information staff by api '%s'".formatted("/api/v1/information-staff"));
        Result<InformationStaffResponse> result = service.deleteInformationStaff(request);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Result<List<InformationStaffResponse>>> getInformationResponse(@PathVariable("email") String request) {
        LOG.info("Call api get information staff by api '%s'".formatted("/api/v1/information-staff"));
        Result<List<InformationStaffResponse>> result = service.getInformationStaffByEmail(request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
