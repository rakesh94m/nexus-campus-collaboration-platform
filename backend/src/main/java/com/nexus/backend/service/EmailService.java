package com.nexus.backend.service;

public interface EmailService {

    void sendOtpEmail(
            String email,
            String otp
    );

}