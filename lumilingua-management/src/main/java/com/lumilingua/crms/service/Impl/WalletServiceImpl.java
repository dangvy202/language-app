package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.common.DateTimeUtils;
import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.BankRequest;
import com.lumilingua.crms.dto.requests.PurchaseRequest;
import com.lumilingua.crms.dto.requests.TransferRequest;
import com.lumilingua.crms.dto.responses.VoucherResponse;
import com.lumilingua.crms.dto.responses.WalletPurchaseHistoryResponse;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.CategoryLevel;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.entity.Wallet;
import com.lumilingua.crms.enums.AmountEnum;
import com.lumilingua.crms.exception.handle.InsufficientBalanceException;
import com.lumilingua.crms.mapper.WalletMapper;
import com.lumilingua.crms.mapper.WalletPurchaseHistoryMapper;
import com.lumilingua.crms.mapper.WalletTransferHistoryMapper;
import com.lumilingua.crms.repository.*;
import com.lumilingua.crms.service.VoucherService;
import com.lumilingua.crms.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private static final Logger LOG = LoggerFactory.getLogger(WalletServiceImpl.class);
    // repository
    private final WalletTransferHistoryRepository walletTransferHistoryRepository;
    private final WalletRepository walletRepository;
    private final WalletPurchaseHistoryRepository walletPurchaseHistoryRepository;
    private final CategoryLevelRepository categoryLevelRepository;
    private final UserRepository userRepository;
    // service
    private final VoucherService voucherService;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED)
    public Result<WalletResponse> fundTransferWallet(TransferRequest request) throws Exception {
        LOG.info("Fund tranfer wallet id '%s' in service...".formatted(request.getReceiveWalletId()));
        Wallet fundWallet = walletRepository.findWalletByIdAndLockDB(request.getFundWalletId()).orElseThrow(() -> new RuntimeException("Unable to get wallet ID: " + request.getFundWalletId()));
        Wallet receivedWallet = walletRepository.findWalletByIdAndLockDB(request.getReceiveWalletId()).orElseThrow(() -> new RuntimeException("Unable to get wallet ID: " + request.getReceiveWalletId()));
        if(request.getAmtType() == AmountEnum.AMT_LEARN) {
            if(fundWallet.getAmountLearn().compareTo(request.getAmount()) >= 0) {
                BigDecimal userFundTranfer = fundWallet.getAmountLearn().subtract(request.getAmount());
                BigDecimal userReceivedTranfer = receivedWallet.getAmountLearn().add(request.getAmount());
                // set and update fund wallet
                fundWallet.setAmountLearn(userFundTranfer);
                walletRepository.save(fundWallet);
                // set and update received wallet
                receivedWallet.setAmountLearn(userReceivedTranfer);
                walletRepository.save(receivedWallet);
                // set and save transfer history
                walletTransferHistoryRepository.save(WalletTransferHistoryMapper.INSTANT.toWalletTransferHistory(
                        "ACTIVE", "AMOUNT_LEARN",
                        "The balance of wallet ID '%s' has been transferred to wallet ID '%s'.".formatted(request.getFundWalletId(), request.getReceiveWalletId()),
                        request.getAmount(), request.getFundWalletId(),
                        request.getReceiveWalletId()));
                return Result.update();
            } else {
                return Result.badRequestError("Insufficient balance");
            }
        } else {
            if(fundWallet.getAmountTopUp().compareTo(request.getAmount()) >= 0) {
                BigDecimal userFundTranfer = fundWallet.getAmountTopUp().subtract(request.getAmount());
                BigDecimal userReceivedTranfer = receivedWallet.getAmountTopUp().add(request.getAmount());
                // set and update fund wallet
                fundWallet.setAmountTopUp(userFundTranfer);
                walletRepository.save(fundWallet);
                // set and update received wallet
                receivedWallet.setAmountTopUp(userReceivedTranfer);
                walletRepository.save(receivedWallet);
                // set and save transfer history
                walletTransferHistoryRepository.save(WalletTransferHistoryMapper.INSTANT.toWalletTransferHistory(
                        "ACTIVE", "AMOUNT_TOPUP",
                        "The balance of wallet ID '%s' has been transferred to wallet ID '%s'.".formatted(request.getFundWalletId(), request.getReceiveWalletId()),
                        request.getAmount(), request.getFundWalletId(),
                        request.getReceiveWalletId()));
                return Result.update();
            } else {
                return Result.badRequestError("Insufficient balance");
            }
        }
    }

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

    @Override
    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED)
    public Result<WalletPurchaseHistoryResponse> purchasePackageCategory(PurchaseRequest request) throws Exception {
        LOG.info("Purchase package id '%s' by wallet id '%s' in service".formatted(request.getPackageCategoryId(), request.getWalletId()));
        Wallet wallet = walletRepository.findById(request.getWalletId())
                .orElseThrow(() -> new RuntimeException("The wallet id '%s' is incorrect".formatted(request.getWalletId())));
        CategoryLevel categoryLevel = categoryLevelRepository.findById(request.getPackageCategoryId())
                .orElseThrow(() -> new RuntimeException("The package id '%s' is incorrect".formatted(request.getPackageCategoryId())));
        User user = userRepository.findUserByWalletId(request.getWalletId())
                .orElseThrow(() -> new RuntimeException("The user is incorrect"));
        if(request.getAmtType() == AmountEnum.AMT_LEARN) {
            if(wallet.getAmountLearn().compareTo(categoryLevel.getPrice()) > 0) {
                // set and update wallet
                wallet.setAmountLearn(wallet.getAmountLearn().subtract(categoryLevel.getPrice()));
                walletRepository.save(wallet);
                // set and update user
                user.setIdCategoryLevel(Integer.parseInt(String.valueOf(categoryLevel.getIdCategoryLevel())));
                userRepository.save(user);
                // set and save purchase history
                walletPurchaseHistoryRepository.save(WalletPurchaseHistoryMapper.INSTANT.toWalletPurchaseHistory(
                        request.getWalletId(),
                        "The purchase for wallet '%s' was successful with package '%s'.'".formatted(request.getWalletId(), categoryLevel.getNameCategoryLevel()),
                        "AMOUNT_LEARN", categoryLevel.getPrice(), "ACTIVE"
                ));
                return Result.update();
            } else {
                return Result.badRequestError("Insufficient balance in wallet id '%s' to process the purchase".formatted(request.getWalletId()));
            }
        } else {
            if(wallet.getAmountTopUp().compareTo(categoryLevel.getPrice()) > 0) {
                // set and update wallet
                wallet.setAmountTopUp(wallet.getAmountTopUp().subtract(categoryLevel.getPrice()));
                walletRepository.save(wallet);
                // set and update user
                user.setIdCategoryLevel(Integer.parseInt(String.valueOf(categoryLevel.getIdCategoryLevel())));
                userRepository.save(user);
                // set and save purchase history
                walletPurchaseHistoryRepository.save(WalletPurchaseHistoryMapper.INSTANT.toWalletPurchaseHistory(
                        request.getWalletId(),
                        "The purchase for wallet '%s' was successful with package '%s'.'".formatted(request.getWalletId(), categoryLevel.getNameCategoryLevel()),
                        "AMOUNT_TOPUP", categoryLevel.getPrice(), "ACTIVE"
                ));
                return Result.update();
            } else {
                return Result.badRequestError("Insufficient balance in wallet id '%s' to process the purchase".formatted(request.getWalletId()));
            }
        }
    }

    @Override
    public Result<WalletResponse> addVoucherByAddressWallet(int idVoucher, String walletId) {
        LOG.info("Add voucher on wallet table in service...");
        try {
            Result<VoucherResponse> voucherResponse = voucherService.getVoucherById(idVoucher);
            if(voucherResponse.code != ResultApiConstant.StatusCode.OK) {
                return Result.badRequestError("The voucher is not exist!");
            }
            Wallet wallet = walletRepository.findById(walletId)
                    .orElseThrow(() -> new RuntimeException("Unable to get wallet ID: " + walletId));
            Date expiredVoucherParse = DateTimeUtils.parseAlphabetToDate(voucherResponse.getData().getExpiredVoucher());
            wallet.setIdVoucher(Long.parseLong(String.valueOf(idVoucher)));
            wallet.setExpiredVoucher(expiredVoucherParse);
            walletRepository.save(wallet);
            LOG.info("Update voucher id '%s' in address wallet id '%s'".formatted(idVoucher, walletId));
            return Result.update();
        } catch (Exception ex) {
            String msg = "Unable to add voucher in address wallet '%s'".formatted(walletId);
            LOG.error(msg);
            return Result.badRequestError(msg);
        }
    }
}
