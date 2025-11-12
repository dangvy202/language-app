package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.BankRequest;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.entity.Wallet;
import com.lumilingua.crms.mapper.WalletMapper;
import com.lumilingua.crms.repository.WalletRepository;
import com.lumilingua.crms.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private static final Logger LOG = LoggerFactory.getLogger(WalletServiceImpl.class);

    private final WalletRepository walletRepository;


    @Override
    public Result<WalletResponse> createWalletByUser(User user) {
        LOG.info("Create wallet in service...");
        try {
            String walletIdRd = UUID.randomUUID().toString();
            Wallet wallet = walletRepository.save(WalletMapper.INSTANT.createWalletByUser(user, walletIdRd));
            WalletResponse response = WalletMapper.INSTANT.toWalletResponse(wallet);
            LOG.info("Create wallet by user is SUCCESS!");
            return Result.create(response);
        } catch (Exception e) {
            throw new RuntimeException("Create wallet by user is FAILED");
        }
    }

    @Override
    public Result<WalletResponse> updateBankInformation(String walletId, BankRequest request) {
        LOG.info("Update bank on wallet table in service...");
        try {
            Wallet walletUpdate = walletRepository.findById(walletId)
                    .map(wallet -> {
                        WalletMapper.INSTANT.updateBankInWallet(request, wallet);
                        return walletRepository.save(wallet);
                    }).orElseThrow(() -> new RuntimeException("Unable to get address wallet '%s'".formatted(walletId)));
            LOG.info("Update bank information is SUCCESS: " + walletUpdate);
            return Result.update();
        } catch (Exception e) {
            String msg = "Unable to update bank information in address wallet '%s'".formatted(walletId);
            LOG.error(msg);
            return Result.badRequestError(msg);
        }
    }
}
