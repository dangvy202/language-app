package com.lumilingua.crms.dto.requests;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class InformationStaffRequest {
    private String email;
    private int hourOfDay;
    private int dayOfWeek;
    private int scoreSpeaking;
    private int scoreReading;
    private int scoreListening;
    private int scoreWriting;
    private String certificatePath;
    private BigDecimal expectedSalary;
    private List<ExperiencedStaffRequest> experienced;
}
