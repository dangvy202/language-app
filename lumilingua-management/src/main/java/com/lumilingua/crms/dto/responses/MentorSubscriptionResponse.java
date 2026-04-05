package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.enums.StatusEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class MentorSubscriptionResponse {
    private long idUser;
    private String emailTrainees;
    private String phoneTrainees;
    private BigDecimal expectedFeeUser;
    private BigDecimal expectedFeeMentor;
    private BigDecimal agreeFee;
    private StatusEnum statusStaff = StatusEnum.PENDING;
    private StatusEnum statusUser = StatusEnum.PENDING;
    private StatusEnum status = StatusEnum.UNPAID;
    private LocalDateTime userPaidAt;
    private BigDecimal summaryFeePlatform;
    private Integer percentFeePlatform;
    private BigDecimal salaryStaff;
    private Date createdAt;
    private Date updatedAt;
    private InformationStaffResponse informationStaffResponse;
}
