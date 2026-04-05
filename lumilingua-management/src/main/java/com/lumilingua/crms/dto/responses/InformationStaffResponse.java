package com.lumilingua.crms.dto.responses;

import com.lumilingua.crms.entity.Skills;
import com.lumilingua.crms.entity.StaffSkill;
import com.lumilingua.crms.enums.StatusEnum;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InformationStaffResponse {
    private int idInformationStaff;
    private double scoreSpeaking;
    private double scoreReading;
    private double scoreListening;
    private double scoreWriting;
    private String certificatePath;
    private String describeInformationStaff;
    private BigDecimal expectedSalary;
    private StatusEnum status;
    private List<ExperiencedStaffResponse> experienced;
    private List<SkillResponse> skills;
    private UserResponse user;
}
