package com.lumilingua.crms.dto.requests;

import com.lumilingua.crms.enums.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MentorSubscriptionRequest {
    private Long idInformationStaff;
    private Long idUser;
    private BigDecimal expectedFeeUser;
    private BigDecimal expectedFeeMentor;
    private String status;
}
