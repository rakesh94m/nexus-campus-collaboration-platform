package com.nexus.backend.repository;

import com.nexus.backend.entity.EmailOtp;
import com.nexus.backend.entity.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findTopByEmailAndPurposeOrderByIdDesc(
            String email,
            OtpPurpose purpose
    );

    @Modifying
    void deleteByEmailAndPurpose(
            String email,
            OtpPurpose purpose
    );
}