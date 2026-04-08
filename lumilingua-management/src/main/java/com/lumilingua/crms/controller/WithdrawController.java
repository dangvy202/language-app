package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.WithdrawRequest;
import com.lumilingua.crms.dto.responses.WithdrawResponse;
import com.lumilingua.crms.enums.WithdrawStatusEnum;
import com.lumilingua.crms.service.WithdrawService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/withdraw")
public class WithdrawController {
    private static final Logger LOG = LoggerFactory.getLogger(WithdrawController.class);

    private final WithdrawService withdrawService;

    @PostMapping
    public ResponseEntity<Result<WithdrawResponse>> createWithdraw(@RequestBody WithdrawRequest request) {
        LOG.info("Create withdraw in controller by api '%s'".formatted("/api/v1/withdraw"));
        Result<WithdrawResponse> result = withdrawService.createWithdraw(request);
        if (result.code == ResultApiConstant.StatusCode.CREATED) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } else if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/update-status")
    public ResponseEntity<Result<WithdrawResponse>> updateStatusWithdraw(@RequestBody WithdrawRequest request) {
        LOG.info("Update status withdraw in controller by api '%s'".formatted("/api/v1/withdraw/update-status"));
        Result<WithdrawResponse> result = withdrawService.updateStatusWithdraw(request);
        if(result.code == ResultApiConstant.StatusCode.NO_CONTENT) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/total")
    public ResponseEntity<Result<BigDecimal>> getSummaryWithdrawByEmailAndStatus(@RequestParam String email,
                                                                                 @RequestParam WithdrawStatusEnum status) {
        LOG.info("Update status withdraw in controller by api '%s'".formatted("/api/v1/withdraw/total"));
        Result<BigDecimal> result = withdrawService.getSummaryWithdrawByEmailAndStatus(email, status);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
