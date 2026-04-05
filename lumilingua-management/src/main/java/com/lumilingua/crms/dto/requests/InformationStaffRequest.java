package com.lumilingua.crms.dto.requests;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InformationStaffRequest {
    private String email;
    private int hourOfDay;
    private String[] dayOfWeek;
    private double scoreSpeaking;
    private double scoreReading;
    private double scoreListening;
    private double scoreWriting;
    private MultipartFile certificatePath;
    private BigDecimal expectedSalary;
    private List<ExperiencedStaffRequest> experienced;
    private List<StaffSkillRequest> staffSkills;
    private String describeInformationStaff;
}
