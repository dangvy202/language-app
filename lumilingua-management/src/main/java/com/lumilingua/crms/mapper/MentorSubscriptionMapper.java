package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.responses.MentorSubscriptionResponse;
import com.lumilingua.crms.entity.MentorSubscription;
import com.lumilingua.crms.enums.StatusEnum;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MentorSubscriptionMapper {
    MentorSubscriptionMapper INSTANT = Mappers.getMapper(MentorSubscriptionMapper.class);

    MentorSubscription toMentorSubscription(long idUser, long idInformationStaff, BigDecimal expectedFeeUser, BigDecimal expectedFeeMentor, BigDecimal agreeFee,
                                            int percentFeePlatform, BigDecimal summaryFeePlatform, BigDecimal salaryStaff, StatusEnum statusStaff,
                                            StatusEnum statusUser, String emailTrainees, String phoneTrainees);
    MentorSubscription toMentorSubscription(long idUser, long idInformationStaff, BigDecimal expectedFeeUser, int percentFeePlatform,
                                            StatusEnum statusStaff, StatusEnum statusUser);
    MentorSubscriptionResponse toMentorSubscriptionResponse(MentorSubscription mentorSubscription);
    List<MentorSubscriptionResponse> toMentorSubscriptionResponses(List<MentorSubscription> mentorSubscriptions);
}
