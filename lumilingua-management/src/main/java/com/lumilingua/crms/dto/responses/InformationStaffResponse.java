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
    private int scoreSpeaking;
    private int scoreReading;
    private int scoreListening;
    private int scoreWriting;
    private String certificatePath;
    private BigDecimal expectedSalary;
    private StatusEnum status;
    private List<ExperiencedStaffResponse> experienced;
    private List<SkillResponse> skills;
    private UserResponse user;
}
