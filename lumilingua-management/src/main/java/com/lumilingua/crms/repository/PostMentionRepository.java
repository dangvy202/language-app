package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.PostMention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostMentionRepository extends JpaRepository<PostMention, Long> {
    List<PostMention> findByIdPostIn(List<Long> postIds);
}
