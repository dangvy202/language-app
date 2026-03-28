package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.constant.CrmsConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.MentorSubscriptionRequest;
import com.lumilingua.crms.dto.responses.MentorSubscriptionResponse;
import com.lumilingua.crms.entity.InformationStaff;
import com.lumilingua.crms.entity.MentorSubscription;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.entity.Wallet;
import com.lumilingua.crms.enums.StatusEnum;
import com.lumilingua.crms.mapper.MentorSubscriptionMapper;
import com.lumilingua.crms.repository.InformationStaffRepository;
import com.lumilingua.crms.repository.MentorSubscriptionRepository;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.repository.WalletRepository;
import com.lumilingua.crms.service.MentorSubscriptionService;
import com.lumilingua.crms.service.WalletService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MentorSubscriptionServiceImpl implements MentorSubscriptionService {
    private static final Logger LOG = LoggerFactory.getLogger(MentorSubscriptionServiceImpl.class);

    // repository
    private final MentorSubscriptionRepository mentorSubscriptionRepository;
    private final UserRepository userRepository;
    private final InformationStaffRepository informationStaffRepository;
    private final WalletRepository walletRepository;

    @Override
    public Result<MentorSubscriptionResponse> pickMentor(MentorSubscriptionRequest request) {
        LOG.info("Create mentor subscription in service...");
        User user = userRepository.findById(request.getIdUser()).orElseThrow(() -> new EntityNotFoundException("User does NOT exists!"));
        InformationStaff informationStaff = informationStaffRepository.findById(request.getIdInformationStaff()).orElseThrow(() -> new EntityNotFoundException("Staff does NOT exists!"));

        try {
            if (request.getExpectedFeeUser() == null || request.getExpectedFeeUser().compareTo(BigDecimal.ZERO) <= 0) {
                BigDecimal agreeFee = informationStaff.getExpectedSalary();
                if (agreeFee == null || agreeFee.compareTo(BigDecimal.ZERO) <= 0) {
                    return Result.badRequestError("Mentor is NOT filled Expected Salary");
                }
                BigDecimal expectedFeeUser = BigDecimal.ZERO;
                int percentFeePlatform = 20;
                BigDecimal summaryFeePlatform = agreeFee
                        .multiply(BigDecimal.valueOf(percentFeePlatform))
                        .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                BigDecimal salaryStaff = agreeFee.subtract(summaryFeePlatform);
                StatusEnum statusStaff = StatusEnum.APPROVE;
                StatusEnum statusUser = StatusEnum.APPROVE;
                MentorSubscription mentorSubscription = MentorSubscriptionMapper.INSTANT.toMentorSubscription(user.getIdUser(),
                        informationStaff.getIdInformationStaff(), expectedFeeUser, agreeFee, percentFeePlatform, summaryFeePlatform,
                        salaryStaff, statusStaff, statusUser);
                mentorSubscriptionRepository.save(mentorSubscription);
            } else {
                BigDecimal expectedFeeUser = request.getExpectedFeeUser();
                int percentFeePlatform = 20;
                StatusEnum statusStaff = StatusEnum.PENDING;
                StatusEnum statusUser = StatusEnum.HOLD;
                MentorSubscription mentorSubscription = MentorSubscriptionMapper.INSTANT.toMentorSubscription(user.getIdUser(),
                        informationStaff.getIdInformationStaff(), expectedFeeUser, percentFeePlatform, statusStaff, statusUser);
                mentorSubscriptionRepository.save(mentorSubscription);
            }
            LOG.info("Pick Mentor is SUCCESS!");
            return Result.create();
        } catch (Exception e) {
            String msg = "Unable to pick mentor!";
            LOG.error(msg);
            return Result.serverError(msg);
        }
    }

    private MentorSubscription approveLogicContract(MentorSubscription mentorSubscription, BigDecimal agreeFee) {
        int percent = mentorSubscription.getPercentFeePlatform() == null ? CrmsConstant.PERCENT_PLATFORM : mentorSubscription.getPercentFeePlatform();
        BigDecimal summaryFeePlatform = agreeFee
                .multiply(BigDecimal.valueOf(percent))
                .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal salaryStaff = agreeFee.subtract(summaryFeePlatform);
        StatusEnum statusStaff = StatusEnum.APPROVE;
        StatusEnum statusUser = StatusEnum.APPROVE;
        mentorSubscription.setAgreeFee(agreeFee);
        mentorSubscription.setSummaryFeePlatform(summaryFeePlatform);
        mentorSubscription.setSalaryStaff(salaryStaff);
        mentorSubscription.setStatusUser(statusUser);
        mentorSubscription.setStatusStaff(statusStaff);
        return mentorSubscription;
    }

    private MentorSubscription rejectLogicContract(MentorSubscription mentorSubscription) {
        StatusEnum statusStaff = StatusEnum.REJECT;
        StatusEnum statusUser = StatusEnum.REJECT;
        mentorSubscription.setStatusStaff(statusStaff);
        mentorSubscription.setStatusUser(statusUser);
        return mentorSubscription;
    }

    @Override
    @Transactional
    public Result<MentorSubscriptionResponse> negotiate(MentorSubscriptionRequest request) {
        LOG.info("Negotiate subscription in service...");
        User user = userRepository.findById(request.getIdUser()).orElseThrow(() -> new EntityNotFoundException("User does NOT exists!"));
        InformationStaff informationStaff = informationStaffRepository.findById(request.getIdInformationStaff()).orElseThrow(() -> new EntityNotFoundException("Staff does NOT exists!"));
        MentorSubscription mentorSubscription = mentorSubscriptionRepository.findMentorSubscriptionByIdUserAndIdInformationStaff(user.getIdUser(), informationStaff.getIdInformationStaff())
                .orElseThrow(() -> new EntityNotFoundException("Unable to get contract of user and mentor"));
        if(mentorSubscription.getStatusStaff() == StatusEnum.PENDING && mentorSubscription.getStatusUser() == StatusEnum.HOLD) {
            if(Objects.equals(request.getStatus(), StatusEnum.APPROVE.name())) {
                BigDecimal agreeFee = mentorSubscription.getExpectedFeeUser();
                if (agreeFee == null || agreeFee.compareTo(BigDecimal.ZERO) <= 0) {
                    return Result.badRequestError("Invalid expected fee");
                }
                mentorSubscriptionRepository.save(approveLogicContract(mentorSubscription, agreeFee));
            } else if(Objects.equals(request.getStatus(), StatusEnum.UNAPPROVE.name())) {
                if(request.getExpectedFeeMentor() == null || request.getExpectedFeeMentor().compareTo(BigDecimal.ZERO) <= 0) {
                    return Result.badRequestError("The expected fee does NOT exists!");
                }
                StatusEnum statusStaff = StatusEnum.HOLD;
                StatusEnum statusUser = StatusEnum.PENDING;
                mentorSubscription.setExpectedFeeMentor(request.getExpectedFeeMentor());
                mentorSubscription.setStatusStaff(statusStaff);
                mentorSubscription.setStatusUser(statusUser);
                mentorSubscriptionRepository.save(mentorSubscription);
            } else if(Objects.equals(request.getStatus(), StatusEnum.REJECT.name())) {
                mentorSubscriptionRepository.save(rejectLogicContract(mentorSubscription));
            }
            return Result.create();
        } else if(mentorSubscription.getStatusStaff() == StatusEnum.HOLD && mentorSubscription.getStatusUser() == StatusEnum.PENDING) {
            if(Objects.equals(request.getStatus(), StatusEnum.APPROVE.name())) {
                BigDecimal agreeFee = mentorSubscription.getExpectedFeeMentor();
                if (agreeFee == null || agreeFee.compareTo(BigDecimal.ZERO) <= 0) {
                    return Result.badRequestError("Invalid mentor expected fee");
                }
                mentorSubscriptionRepository.save(approveLogicContract(mentorSubscription, agreeFee));
            } else if(Objects.equals(request.getStatus(), StatusEnum.UNAPPROVE.name())) {
                if(request.getExpectedFeeUser() == null || request.getExpectedFeeUser().compareTo(BigDecimal.ZERO) <= 0) {
                    return Result.badRequestError("The expected fee does NOT exists!");
                }
                StatusEnum statusStaff = StatusEnum.PENDING;
                StatusEnum statusUser = StatusEnum.HOLD;
                mentorSubscription.setExpectedFeeUser(request.getExpectedFeeUser());
                mentorSubscription.setStatusStaff(statusStaff);
                mentorSubscription.setStatusUser(statusUser);
                mentorSubscriptionRepository.save(mentorSubscription);
            } else if(Objects.equals(request.getStatus(), StatusEnum.REJECT.name())) {
                mentorSubscriptionRepository.save(rejectLogicContract(mentorSubscription));
            }
            return Result.create();
        } else {
            return Result.badRequestError("Unable to negotiate the contract");
        }
    }

    @Override
    public Result<MentorSubscriptionResponse> getContractByUserIdAndStaffIf(MentorSubscriptionRequest request) {
        LOG.info("Get contract by user id '%s' and staff id '%s' in service...".formatted(request.getIdUser(),request.getIdInformationStaff()));
        MentorSubscription mentorSubscription = mentorSubscriptionRepository.findMentorSubscriptionByIdUserAndIdInformationStaff(request.getIdUser(), request.getIdInformationStaff())
                .orElseThrow(() -> new EntityNotFoundException("Unable to get contract of user and mentor"));
        return Result.get(MentorSubscriptionMapper.INSTANT.toMentorSubscriptionResponse(mentorSubscription));
    }

    @Override
    public Result<List<MentorSubscriptionResponse>> getContractByIdUser(long id) {
        LOG.info("Get contract by user id '%s' in service...".formatted(id));
        List<MentorSubscription> mentorSubscriptions = mentorSubscriptionRepository.findMentorSubscriptionByIdUser(id);
        return Result.get(MentorSubscriptionMapper.INSTANT.toMentorSubscriptionResponses(mentorSubscriptions));
    }

    @Override
    public Result<List<MentorSubscriptionResponse>> getContractByIdStaff(long id) {
        LOG.info("Get contract by staff id '%s' in service...".formatted(id));
        List<MentorSubscription> mentorSubscriptions = mentorSubscriptionRepository.findMentorSubscriptionByIdInformationStaff(id);
        return Result.get(MentorSubscriptionMapper.INSTANT.toMentorSubscriptionResponses(mentorSubscriptions));
    }

    @Override
    @Transactional
    public Result<MentorSubscriptionResponse> paidContract(MentorSubscriptionRequest request) {
        LOG.info("Paid contract in service...");
        MentorSubscription mentorSubscription = mentorSubscriptionRepository.findMentorSubscriptionByIdUserAndIdInformationStaff(request.getIdUser(), request.getIdInformationStaff())
                .orElseThrow(() -> new EntityNotFoundException("Unable to get contract of user and mentor"));
        User user = userRepository.findById(request.getIdUser())
                .orElseThrow(() -> new EntityNotFoundException("Unable to get address wallet from user id '%s'".formatted(request.getIdUser())));
        Wallet wallet = walletRepository.findWalletByIdAndLockDB(user.getWalletId())
                .orElseThrow(() -> new EntityNotFoundException("Unable to get wallet from wallet id '%s'".formatted(user.getWalletId())));
        if(mentorSubscription.getStatus() == StatusEnum.PAID){
            return Result.badRequestError("Contract already paid!");
        }
        if(mentorSubscription.getStatusUser() == StatusEnum.APPROVE && mentorSubscription.getStatusStaff() == StatusEnum.APPROVE) {
            BigDecimal agreeFee = mentorSubscription.getAgreeFee();
            BigDecimal amtTopUp = wallet.getAmountTopUp();
            if (agreeFee == null || agreeFee.compareTo(BigDecimal.ZERO) <= 0 || amtTopUp == null) {
                return Result.badRequestError("Invalid agree fee or money in wallet!");
            }
            if(amtTopUp.compareTo(agreeFee) >= 0) {
                mentorSubscription.setStatus(StatusEnum.PAID);
                mentorSubscription.setUserPaidAt(LocalDateTime.now());
                wallet.setAmountTopUp(amtTopUp.subtract(agreeFee));
                walletRepository.save(wallet);
                mentorSubscriptionRepository.save(mentorSubscription);
                return Result.updateContentAndNotification(MentorSubscriptionMapper.INSTANT.toMentorSubscriptionResponse(mentorSubscription), "The contract have been paid!");
            } else {
                return Result.serverError("The account balance is not enough to pay!");
            }
        }
        return Result.serverError("The contract status has not been approved by the staff or the user!");
    }
}
