package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_information_staff",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "id_user")
        })
public class InformationStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_information_staff")
    private long idInformationStaff;

    @Column(name = "score_speaking")
    private int scoreSpeaking;

    @Column(name = "score_reading")
    private int scoreReading;

    @Column(name = "score_listening")
    private int scoreListening;

    @Column(name = "score_writing")
    private int scoreWriting;

    @Column(name = "certificate_path")
    private String certificatePath;

    @Column(name = "status")
    private String status;

    @Column(name = "expected_salary")
    private BigDecimal expectedSalary;

    @Column(name = "hour_of_day")
    private int hourOfDay;

    @Column(name = "day_of_week")
    private int dayOfWeek;

    @Column(name = "id_user")
    private long idUser;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
