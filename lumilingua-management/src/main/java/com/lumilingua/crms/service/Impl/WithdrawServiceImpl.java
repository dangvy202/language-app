package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.WithdrawRequest;
import com.lumilingua.crms.dto.responses.WithdrawResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.entity.Wallet;
import com.lumilingua.crms.entity.Withdraw;
import com.lumilingua.crms.enums.WithdrawStatusEnum;
import com.lumilingua.crms.mapper.WithdrawMapper;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.repository.WalletRepository;
import com.lumilingua.crms.repository.WithdrawRepository;
import com.lumilingua.crms.service.WithdrawService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WithdrawServiceImpl implements WithdrawService {
    private static final Logger LOG = LoggerFactory.getLogger(WithdrawServiceImpl.class);

    private final WithdrawRepository withdrawRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<WithdrawResponse> createWithdraw(WithdrawRequest request) {
        LOG.info("Create withdraw in service...");
        User user = userRepository.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Unable to get user by email '%s'".formatted(request.getEmail())));

        Wallet wallet = walletRepository.findWalletByIdAndLockDB(user.getWalletId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Unable to get wallet by user id '%s'".formatted(user.getIdUser())));

        BigDecimal withdrawAmount = request.getAmtWithdraw();

        if (withdrawAmount == null || withdrawAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return Result.badRequestError("The withdraw need to more than 0");
        }

        if (withdrawAmount.compareTo(new BigDecimal("5000")) < 0) {
            return Result.badRequestError("The withdraw need to more than 5000");
        }

        if (wallet.getAmountTopUp().compareTo(withdrawAmount) < 0) {
            return Result.badRequestError("The balance of top up does NOT enough!");
        }

        if (!wallet.isActive()) {
            return Result.badRequestError("The wallet '%s' is INACTIVE".formatted(wallet.getWalletId()));
        }

        if (wallet.getBankName() == null || wallet.getBankBranch() == null ||
                wallet.getBankIdentification() == null || wallet.getBankHolder() == null) {
            return Result.badRequestError("The information bank is empty!");
        }

        Withdraw withdraw = WithdrawMapper.INSTANT.toWithdraw(request);
        withdraw.setAmtWithdraw(request.getAmtWithdraw());
        withdraw.setIdUser(user.getIdUser());
        withdraw.setStatus(WithdrawStatusEnum.PENDING);
        withdraw.setWalletId(wallet.getWalletId());

        withdraw = withdrawRepository.save(withdraw);

        wallet.setAmountTopUp(wallet.getAmountTopUp().subtract(withdrawAmount));
        walletRepository.save(wallet);

        LOG.info("Create withdraw successfully. Withdraw ID: {}, Amount: {}",
                withdraw.getIdWithdraw(), withdrawAmount);
        return Result.create(WithdrawMapper.INSTANT.toWithdrawResponse(withdraw));
    }

    @Override
    public Result<BigDecimal> getSummaryWithdrawByEmailAndStatus(String email, WithdrawStatusEnum status) {
        LOG.info("Get summary withdraw success for user email: {}", email);

        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Unable to get user by email '%s'".formatted(email)));
        BigDecimal total = withdrawRepository.findTotalWithdrawByStatusAndIdUser(user.getIdUser(), status);
        LOG.info("Total withdraw success for user {}: {}", user.getIdUser(), total);
        return Result.get(total);
    }

    @Override
    public Result<List<WithdrawResponse>> getAllWithdrawSuccess(WithdrawRequest request) {
        return null;
    }

    @Override
    public Result<List<WithdrawResponse>> getAllWithdrawFail(WithdrawRequest request) {
        return null;
    }

    @Override
    public Result<WithdrawResponse> updateStatusWithdraw(WithdrawRequest request) {
        LOG.info("Update status withdraw in service...");

        Withdraw withdraw = withdrawRepository.findById(request.getIdWithdraw())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Unable to get withdraw with id: " + request.getIdWithdraw()));

        if (request.getStatus() == WithdrawStatusEnum.REJECTED &&
                (request.getReason() == null || request.getReason().trim().isEmpty())) {
            throw new IllegalArgumentException("Reason is required when rejecting withdraw");
        }

        withdraw.setStatus(request.getStatus());
        withdraw.setReason(request.getReason());
        withdrawRepository.save(withdraw);

        LOG.info("Withdraw status updated successfully. ID: {}, New Status: {}", withdraw.getIdWithdraw(), request.getStatus());
        return Result.update();
    }

    @Override
    public Result<WithdrawResponse> updateEvidenceWithdraw(WithdrawRequest request) {
        return null;
    }
}
