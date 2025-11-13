package com.lumilingua.crms.entity;

import com.lumilingua.crms.enums.GenderEnum;
import com.lumilingua.crms.enums.RoleEnum;
import com.lumilingua.crms.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;


@Data
@Entity
@Table(name = "tbl_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private long idUser;

    @Column(name = "username", unique = true)
    private String username;
    
    @Column(name = "password")
    private String password;
    
    @Column(name = "token_account", unique = true)
    private String tokenAccount;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    @Column(name = "is_active")
    private boolean active;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
    
    @Column(name = "refresh_token")
    private String refreshToken;
    
    @Column(name = "provider")
    private String provider;
    
    @Column(name = "provider_id", unique = true)
    private String providerId;
    
    @Column(name = "avatar")
    private String avatar;
    
    @Column(name = "last_login")
    private Date lastLogin;
    
    @Column(name = "wallet_id", unique = true)
    private String walletId;
    
    @Column(name = "id_category_level")
    private int idCategoryLevel;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
