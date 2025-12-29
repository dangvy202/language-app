package com.lumilingua.crms.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class InformationStaffResponse {
    private int scoreSpeaking;
    private int scoreReading;
    private int scoreListening;
    private int scoreWriting;
    private String certificatePath;
    private BigDecimal expectedSalary;
    private List<ExperiencedStaffResponse> experienced;
}
