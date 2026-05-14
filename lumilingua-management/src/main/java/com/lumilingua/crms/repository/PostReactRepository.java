package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.PostReact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostReactRepository extends JpaRepository<PostReact, Long> {
    Optional<PostReact> findPostReactByIdPostAndIdUser(long idPost, long idUser);
    List<PostReact> findByIdPostInAndIdUser(List<Long> postIds, Long idUser);
}
