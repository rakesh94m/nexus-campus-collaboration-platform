package com.nexus.backend.service;

import com.nexus.backend.dto.request.LoginRequest;
import com.nexus.backend.dto.request.RegisterRequest;
import com.nexus.backend.dto.response.AuthResponse;

public interface AuthService {

    // Existing
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    // OTP Registration
    String sendRegistrationOtp(String email);

    String verifyRegistrationOtpCode(
            String email,
            String otp
    );

    AuthResponse verifyRegistrationOtp(RegisterRequest request);

    // Forgot Password
    String sendForgotPasswordOtp(String email);

    String resetPassword(
            String email,
            String otp,
            String newPassword,
            String confirmPassword
    );
}