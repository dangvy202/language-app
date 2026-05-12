package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.Post;
import com.lumilingua.crms.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByPostTypeOrderByCreatedAtDesc(PostType postType, Pageable pageable);
    Page<Post> findByParentPostIdOrderByCreatedAtDesc(
            Long parentPostId,
            Pageable pageable
    );

    List<Post> findByParentPostIdInOrderByCreatedAtDesc(
            List<Long> parentPostIds
    );
}
