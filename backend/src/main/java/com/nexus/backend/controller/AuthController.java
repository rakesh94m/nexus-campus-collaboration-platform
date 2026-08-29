package com.nexus.backend.controller;

import com.nexus.backend.dto.request.LoginRequest;
import com.nexus.backend.dto.request.OtpRequest;
import com.nexus.backend.dto.request.RegisterRequest;
import com.nexus.backend.dto.request.ResetPasswordRequest;
import com.nexus.backend.dto.response.AuthResponse;
import com.nexus.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nexus.backend.dto.request.VerifyOtpRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // ==========================================
    // REGISTER (after OTP verification)
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.verifyRegistrationOtp(request));
    }

    // ==========================================
    // SEND REGISTRATION OTP
    // ==========================================

    @PostMapping("/send-registration-otp")
    public ResponseEntity<String> sendRegistrationOtp(
            @Valid @RequestBody OtpRequest request) {

        return ResponseEntity.ok(
                authService.sendRegistrationOtp(request.getEmail())
        );
    }

    // ==========================================
    // VERIFY REGISTRATION OTP
    // ==========================================

        @PostMapping("/verify-registration-otp")
        public ResponseEntity<String> verifyRegistrationOtp(
                @Valid @RequestBody VerifyOtpRequest request) {

            return ResponseEntity.ok(
                    authService.verifyRegistrationOtpCode(
                            request.getEmail(),
                            request.getOtp()
                    )
            );
        }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // ==========================================
    // SEND FORGOT PASSWORD OTP
    // ==========================================

    @PostMapping("/send-forgot-password-otp")
    public ResponseEntity<String> sendForgotPasswordOtp(
            @Valid @RequestBody OtpRequest request) {

        return ResponseEntity.ok(
                authService.sendForgotPasswordOtp(request.getEmail())
        );
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(
                        request.getEmail(),
                        request.getOtp(),
                        request.getNewPassword(),
                        request.getConfirmPassword()
                )
        );
    }
}