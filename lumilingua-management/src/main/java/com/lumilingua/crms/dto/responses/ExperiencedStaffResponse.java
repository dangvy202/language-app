package com.lumilingua.crms.dto.responses;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
public class ExperiencedStaffResponse {
    private long idExperienced;
    private String companyName;
    private LocalDate fromDate;
    private LocalDate toDate;
    private int yearsOfExperience;
}
