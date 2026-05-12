package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.PostReact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostReactRepository extends JpaRepository<PostReact, Long> {
}
