package com.lumilingua.crms.entity;

import com.lumilingua.crms.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "tbl_category_level")
public class CategoryLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_category_level")
    private long idCategoryLevel;

    @Column(name = "name_category_level", unique = true, nullable = false)
    private String nameCategoryLevel;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "actual_price")
    private BigDecimal actualPrice;

    @Column(name = "sale_off")
    private Integer saleOff;

    @Column(name = "expired_date")
    private String expiredDate;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    @Column(name = "img_path")
    private String imgPath;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
