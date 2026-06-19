package com.project.shopapp.repositories;

import com.project.shopapp.models.Otp;
import com.project.shopapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}