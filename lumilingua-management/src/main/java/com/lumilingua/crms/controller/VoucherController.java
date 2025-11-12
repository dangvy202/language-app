package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.VoucherRequest;
import com.lumilingua.crms.dto.responses.VoucherResponse;
import com.lumilingua.crms.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/voucher")
public class VoucherController {
    private static final Logger LOG = LoggerFactory.getLogger(VoucherController.class);

    private final VoucherService voucherService;

    @PostMapping
    public ResponseEntity<Result<VoucherResponse>> createVoucher(@RequestBody VoucherRequest voucherRequest) {
        LOG.info("Create voucher in controller by api '%s'".formatted("/api/v1/voucher"));
        Result<VoucherResponse> result = voucherService.createVoucher(voucherRequest);
        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Result<VoucherResponse>> updateVoucher(@RequestParam("voucher-id") int id, @RequestBody VoucherRequest request) {
        LOG.info("Update voucher in controller by api '%s'".formatted("/api/v1/voucher"));
        Result<VoucherResponse> result = voucherService.updateVoucher(id, request);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Result<List<VoucherResponse>>> getAllVoucher() {
        LOG.info("Get all voucher in controller by api '%s'".formatted("/api/v1/voucher"));
        Result<List<VoucherResponse>> results = voucherService.getAllVoucher();
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/id")
    public ResponseEntity<Result<VoucherResponse>> getVoucherById(@RequestParam("id") int id) {
        LOG.info("Get voucher by id in controller by api '%s'".formatted("/api/v1/voucher/id?id='%s'".formatted(id)));
        Result<VoucherResponse> result = voucherService.getVoucherById(id);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/id")
    public ResponseEntity<Result<VoucherResponse>> deleteVoucherById(@RequestParam("id") int id) {
        LOG.info("Delete voucher by id in controller by api '%s'".formatted("/api/v1/voucher/id?id='%s'".formatted(id)));
        Result<VoucherResponse> result = voucherService.deleteVoucherById(id);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }
}
