package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.BankRequest;
import com.lumilingua.crms.dto.requests.PurchaseRequest;
import com.lumilingua.crms.dto.requests.TransferRequest;
import com.lumilingua.crms.dto.responses.WalletPurchaseHistoryResponse;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.entity.WalletPurchaseHistory;

public interface WalletService {
//  User
    Result<WalletResponse> fundTransferWallet(TransferRequest request) throws Exception;
    Result<WalletResponse> createWalletByUser(User user);
    Result<WalletResponse> updateBankInformation(String walletId, BankRequest request);
    Result<WalletPurchaseHistoryResponse> purchasePackageCategory(PurchaseRequest request) throws Exception;
//  Admin
    Result<WalletResponse> addVoucherByAddressWallet(int idVoucher, String walletId);
}
