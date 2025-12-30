package com.lumilingua.crms.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
public class ExperiencedStaffRequest {
    private String companyName;
    private LocalDate fromDate;
    private LocalDate toDate;
}
