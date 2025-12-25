package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.responses.WalletPurchaseHistoryResponse;
import com.lumilingua.crms.repository.WalletPurchaseHistoryRepository;
import com.lumilingua.crms.service.WalletPurchaseHistoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletPurchaseHistoryServiceImpl implements WalletPurchaseHistoryService {

    private static final Logger LOG = LoggerFactory.getLogger(WalletPurchaseHistoryServiceImpl.class);

    private final WalletPurchaseHistoryRepository walletPurchaseHistoryRepository;

    @Override
    public Result<WalletPurchaseHistoryResponse> writeWalletPurchaseHistory() {
        LOG.info("Write Wallet Purchase History in service...");

        return null;
    }
}
