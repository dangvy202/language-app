package com.lumilingua.crms.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExperiencedStaffRequest {
    private String companyName;
    private LocalDate fromDate;
    private LocalDate toDate;
}
