package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.BankRequest;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;

public interface WalletService {
//  User
    Result<WalletResponse> createWalletByUser(User user);
    Result<WalletResponse> updateBankInformation(String walletId, BankRequest request);
    Result<WalletResponse> addVoucherByAddressWallet(int idVoucher, String walletId);
}
