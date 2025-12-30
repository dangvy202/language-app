package com.lumilingua.crms.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_experienced_staff")
public class ExperiencedStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_experienced")
    private long idExperienced;

    @Column(name = "id_information_staff")
    private long idInformationStaff;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "from_date")
    private LocalDate fromDate;

    @Column(name = "to_date")
    private LocalDate toDate;

    @Column(name = "years_of_experience")
    private double yearsOfExperience;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
