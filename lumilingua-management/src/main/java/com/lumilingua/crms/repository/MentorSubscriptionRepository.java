package com.lumilingua.crms.repository;

import com.lumilingua.crms.entity.MentorSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorSubscriptionRepository extends JpaRepository<MentorSubscription, Long> {
    Optional<MentorSubscription> findMentorSubscriptionByIdUserAndIdInformationStaff(long idUser, long idInformationStaff);
}
