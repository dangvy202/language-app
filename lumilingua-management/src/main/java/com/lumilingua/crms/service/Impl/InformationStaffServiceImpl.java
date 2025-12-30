package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.common.DateTimeUtils;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.ExperiencedStaffRequest;
import com.lumilingua.crms.dto.requests.InformationStaffRequest;
import com.lumilingua.crms.dto.responses.InformationStaffResponse;
import com.lumilingua.crms.entity.ExperiencedStaff;
import com.lumilingua.crms.entity.InformationStaff;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.mapper.ExperiencedStaffMapper;
import com.lumilingua.crms.mapper.InformationStaffMapper;
import com.lumilingua.crms.repository.ExperiencedStaffRepository;
import com.lumilingua.crms.repository.InformationStaffRepository;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.service.ExperiencedStaffService;
import com.lumilingua.crms.service.InformationStaffService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InformationStaffServiceImpl implements InformationStaffService {
    private static final Logger LOG = LoggerFactory.getLogger(CategoryLevelServiceImpl.class);
    // repository
    private final InformationStaffRepository informationStaffRepository;
    private final ExperiencedStaffRepository experiencedStaffRepository;
    private final UserRepository userRepository;

    // service
    private final ExperiencedStaffService experiencedStaffService;

    @Override
    @Transactional
    public Result<InformationStaffResponse> createInformationStaff(InformationStaffRequest request) {
        LOG.info("Create information staff in service...");
        Optional<User> user = userRepository.findUserByEmail(request.getEmail());
        if(user.isEmpty()) {
            return Result.badRequestError("The Email does NOT exists");
        }
        InformationStaff informationStaff = informationStaffRepository.save(InformationStaffMapper.INSTANT.toInformationStaff(request, request.getCertificatePath(), user.get().getIdUser()));
        List<ExperiencedStaff> experiencedStaffGenerate = request.getExperienced().stream().map(x -> ExperiencedStaffMapper.INSTANT.toExperiencedStaff(x, DateTimeUtils.calculateYearsExperience(x.getFromDate(), x.getToDate())))
                .peek(es -> es.setIdInformationStaff(informationStaff.getIdInformationStaff()))
                .toList();
        experiencedStaffRepository.saveAll(experiencedStaffGenerate);
        return Result.create(InformationStaffMapper.INSTANT.toInformationStaffResponse(request));
    }

    @Override
    @Transactional
    public Result<InformationStaffResponse> deleteInformationStaff(InformationStaffRequest request) {
        LOG.info("Delete information staff in service...");
        Optional<User> user = userRepository.findUserByEmail(request.getEmail());
        if(user.isEmpty()) {
            return Result.badRequestError("The Email does NOT exists");
        }
        Optional<InformationStaff> informationStaff = informationStaffRepository.findByIdUser(user.get().getIdUser());
        if(informationStaff.isEmpty()) {
            return Result.badRequestError("The Information Staff does NOT exists");
        }
        List<ExperiencedStaff> experiencedStaff = experiencedStaffRepository.findExperiencedStaffByIdInformationStaff(informationStaff.get().getIdInformationStaff());
        if(experiencedStaff.isEmpty()) {
            return Result.badRequestError("The Experienced Staff does NOT exists");
        }
        informationStaffRepository.delete(informationStaff.get());
        experiencedStaffRepository.deleteAll(experiencedStaff);
        return Result.delete();
    }

    @Override
    public Result<InformationStaffResponse> getInformationStaffByEmail(InformationStaffRequest request) {
        LOG.info("Get information staff in service...");
        Optional<User> user = userRepository.findUserByEmail(request.getEmail());
        if(user.isEmpty()) {
            return Result.badRequestError("The Email does NOT exists");
        }
        Optional<InformationStaff> informationStaff = informationStaffRepository.findByIdUser(user.get().getIdUser());
        if(informationStaff.isEmpty()) {
            return Result.badRequestError("The Information Staff does NOT exists");
        }
        List<ExperiencedStaff> experiencedStaff = experiencedStaffRepository.findExperiencedStaffByIdInformationStaff(informationStaff.get().getIdInformationStaff());
        if(experiencedStaff.isEmpty()) {
            return Result.badRequestError("The Experienced Staff does NOT exists");
        }
        return Result.get(InformationStaffMapper.INSTANT.toInformationStaffResponseMapper(informationStaff.get(), experiencedStaff));
    }

    @Override
    @Transactional
    public Result<InformationStaffResponse> editInformationStaffByEmail(InformationStaffRequest request) {
        LOG.info("Edit information staff account in service...");
        Optional<User> user = userRepository.findUserByEmail(request.getEmail());
        if(user.isEmpty()) {
            return Result.badRequestError("The Email does NOT exists");
        }
        Optional<InformationStaff> informationStaff = informationStaffRepository.findByIdUser(user.get().getIdUser());
        if(informationStaff.isEmpty()) {
            return Result.badRequestError("The Information Staff does NOT exists");
        }
        List<ExperiencedStaff> experiencedStaffs = experiencedStaffRepository.findExperiencedStaffByIdInformationStaff(informationStaff.get().getIdInformationStaff());
        if(experiencedStaffs.isEmpty()) {
            return Result.badRequestError("The Experienced Staff does NOT exists");
        }
        InformationStaff informationStaffBuilder = informationStaff.get();
        informationStaffBuilder.setHourOfDay(request.getHourOfDay());
        informationStaffBuilder.setDayOfWeek(request.getDayOfWeek());
        informationStaffBuilder.setScoreReading(request.getScoreReading());
        informationStaffBuilder.setScoreListening(request.getScoreListening());
        informationStaffBuilder.setScoreSpeaking(request.getScoreSpeaking());
        informationStaffBuilder.setScoreWriting(request.getScoreWriting());
        informationStaffBuilder.setExpectedSalary(request.getExpectedSalary());
        informationStaffBuilder.setCertificatePath(request.getCertificatePath());

        for(int i = 0 ; i < experiencedStaffs.size(); i++) {
            ExperiencedStaff experiencedStaff = experiencedStaffs.get(i);
            ExperiencedStaffRequest experiencedStaffRequest = request.getExperienced().get(i);

            LocalDate fromDate = experiencedStaffRequest.getFromDate();
            LocalDate toDate = experiencedStaffRequest.getToDate();
            experiencedStaff.setCompanyName(experiencedStaffRequest.getCompanyName());
            experiencedStaff.setFromDate(fromDate);
            experiencedStaff.setToDate(toDate);
            experiencedStaff.setYearsOfExperience(DateTimeUtils.calculateYearsExperience(fromDate, toDate));
            experiencedStaffRepository.save(experiencedStaff);
        }
        informationStaffRepository.save(informationStaffBuilder);
        return Result.update();
    }

    @Override
    public Result<InformationStaffResponse> activeContractStaff(long id) {
        LOG.info("Active information staff account in service...");
        Optional<InformationStaff> informationStaff = informationStaffRepository.findById(id);
        if(informationStaff.isEmpty()) {
            return Result.badRequestError("The information staff does NOT exists");
        }
        informationStaff.get().setStatus("ACTIVE");
        informationStaffRepository.save(informationStaff.get());
        return Result.update();
    }

    @Override
    public Result<InformationStaffResponse> rejectContractStaff(long id) {
        LOG.info("Reject information staff account in service...");
        Optional<InformationStaff> informationStaff = informationStaffRepository.findById(id);
        if(informationStaff.isEmpty()) {
            return Result.badRequestError("The information staff does NOT exists");
        }
        informationStaff.get().setStatus("REJECT");
        informationStaffRepository.save(informationStaff.get());
        return Result.update();
    }
}
