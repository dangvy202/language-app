package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findUserByEmail(String email);
    Optional<User> findUserByPhone(String phone);
    Optional<User> findUserByUsername(String userName);
    Optional<User> findUserByWalletId(String walletId);
    List<User> findByIdUserIn(List<Long> ids);

    @Query("""
        SELECT u
        FROM User u
        WHERE LOWER(u.username)
        LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<User> searchUserByUsername(String name);
}
