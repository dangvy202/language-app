package com.lumilingua.crms.service;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.responses.WalletPurchaseHistoryResponse;

public interface WalletPurchaseHistoryService {
    Result<WalletPurchaseHistoryResponse> writeWalletPurchaseHistory();
}
