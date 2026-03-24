package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@Entity
@Table(name = "tbl_staff_skill",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"id_information_staff", "id_skill"})
        })
public class StaffSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_staff_skill")
    private long idStaffSkill;

    @Column(name = "id_information_staff")
    private long idInformationStaff;

    @Column(name = "id_skill")
    private long idSkill;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
