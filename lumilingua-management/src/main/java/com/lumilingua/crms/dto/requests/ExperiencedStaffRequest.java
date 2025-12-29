package com.lumilingua.crms.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class ExperiencedStaffRequest {
    private String companyName;
    private Date fromDate;
    private Date toDate;
    private int yearsOfExperience;
}
