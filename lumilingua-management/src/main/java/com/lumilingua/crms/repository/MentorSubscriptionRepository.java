package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.MentorSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorSubscriptionRepository extends JpaRepository<MentorSubscription, Long> {
    Optional<MentorSubscription> findMentorSubscriptionByIdUserAndIdInformationStaff(long idUser, long idInformationStaff);
    @Query("""
        SELECT m, i, u
        FROM MentorSubscription m
            LEFT JOIN InformationStaff i 
                ON i.idInformationStaff = m.idInformationStaff
            LEFT JOIN User u
                ON u.idUser = i.idUser
        WHERE m.idUser = :idUser
    """)
    List<Object[]> findMentorSubscriptionByIdUser(long idUser);

    @Query("""
        SELECT m , i , u FROM MentorSubscription m
            LEFT JOIN InformationStaff i
                ON i.idInformationStaff = m.idInformationStaff
            LEFT JOIN User u
                ON u.idUser = i.idUser
            WHERE i.idUser = :idUser
    """)
    List<Object[]> findMentorSubscriptionByIdInformationStaff(long idUser);

    List<MentorSubscription> findByIdUser(long idUser);
}
