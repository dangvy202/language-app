package com.lumilingua.crms.entity;

import com.lumilingua.crms.enums.PostType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@Entity
@Table(name = "tbl_post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_post")
    private long idPost;

    @Column(name = "id_user")
    private long idUser;

    @Column(name = "content")
    private String content;

    @Column(name = "parent_post_id")
    private Long parentPostId;

    @Column(name = "post_type")
    @Enumerated(EnumType.STRING)
    private PostType postType;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
