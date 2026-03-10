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
    private int scoreSpeaking;
    private int scoreReading;
    private int scoreListening;
    private int scoreWriting;
    private MultipartFile certificatePath;
    private BigDecimal expectedSalary;
    private List<ExperiencedStaffRequest> experienced;
}
