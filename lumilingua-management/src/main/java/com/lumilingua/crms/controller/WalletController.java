package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.BankRequest;
import com.lumilingua.crms.dto.requests.PurchaseRequest;
import com.lumilingua.crms.dto.requests.TransferRequest;
import com.lumilingua.crms.dto.responses.WalletPurchaseHistoryResponse;
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

    @PutMapping("/add-voucher/{voucher-id}")
    public ResponseEntity<Result<WalletResponse>> addVoucherInWallet (@PathVariable("voucher-id") int idVoucher, @RequestParam("wallet-id") String idWallet) {
        LOG.info("Add voucher id '%s' in wallet address '%s' by api '%s'".formatted(idVoucher, idWallet, "/api/v1/wallet/add-voucher"));
        Result<WalletResponse> result = walletService.addVoucherByAddressWallet(idVoucher,idWallet);
        if(result.code == ResultApiConstant.StatusCode.BAD_REQUEST) {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
    }

    @PutMapping("/transfer")
    public ResponseEntity<Result<WalletResponse>> fundTransferWallet(@RequestBody TransferRequest request) throws Exception {
        LOG.info("Fund transfer wallet id '%s' to receive wallet id '%s' by api '%s'".formatted(request.getFundWalletId(), request.getReceiveWalletId(), "/api/v1/wallet/transfer"));
        Result<WalletResponse> result = walletService.fundTransferWallet(request);
        if(result.code == ResultApiConstant.StatusCode.NO_CONTENT) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/purchase")
    public ResponseEntity<Result<WalletPurchaseHistoryResponse>> purchasePackage(@RequestBody PurchaseRequest request) throws Exception {
        LOG.info("Purchase package id '%s' vip in wallet id '%s' by api".formatted(request.getPackageCategoryId(), request.getWalletId(), "/api/v1/wallet/purchase"));
        Result<WalletPurchaseHistoryResponse> result = walletService.purchasePackageCategory(request);
        return null;
    }
}
