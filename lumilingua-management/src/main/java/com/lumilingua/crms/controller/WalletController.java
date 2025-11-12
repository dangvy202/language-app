package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.BankRequest;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wallet")
public class WalletController {
    private static final Logger LOG = LoggerFactory.getLogger(WalletController.class);

    private final WalletService walletService;

    @PutMapping("/update/bank")
    public ResponseEntity<Result<WalletResponse>> updateBankInWallet(@RequestParam("wallet-id") String id, @RequestBody BankRequest request) {
        LOG.info("User update bank information in controller by api '%s'".formatted("/api/v1/wallet/update/bank?wallet-id='%s'".formatted(id)));
        Result<WalletResponse> result = walletService.updateBankInformation(id, request);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }
}
