package com.lumilingua.crms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@Entity
@Table(name = "tbl_feature_app",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "feature_name")
        })
public class FeatureApp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_feature_app")
    private long idFeatureApp;

    @Column(name = "feature_name")
    private String featureName;

    @Column(name = "description")
    private String description;

    @Column(name = "icon")
    private String icon;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
