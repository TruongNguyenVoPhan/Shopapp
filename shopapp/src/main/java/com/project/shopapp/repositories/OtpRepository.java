package com.project.shopapp.repositories;

import com.project.shopapp.models.Otp;
import com.project.shopapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);

    void deleteByUser(User user);
}