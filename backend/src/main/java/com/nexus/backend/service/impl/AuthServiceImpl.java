package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.LoginRequest;
import com.nexus.backend.dto.request.RegisterRequest;
import com.nexus.backend.dto.response.AuthResponse;
import com.nexus.backend.entity.EmailOtp;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.OtpPurpose;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.EmailOtpRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.security.CustomUserDetails;
import com.nexus.backend.security.JwtService;
import com.nexus.backend.service.AuthService;
import com.nexus.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final StudentRepository studentRepository;
    private final EmailOtpRepository emailOtpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // ==========================================
    // Generate 6-digit OTP
    // ==========================================

    private String generateOtp() {
        return String.valueOf(
                100000 + new Random().nextInt(900000)
        );
    }

    // ==========================================
    // REGISTER (Required by Interface)
    // Redirects to OTP verification
    // ==========================================

    @Override
    public AuthResponse register(RegisterRequest request) {
        return verifyRegistrationOtp(request);
    }

    // ==========================================
    // SEND REGISTRATION OTP
    // ==========================================

    @Override
    @Transactional
    public String sendRegistrationOtp(String email) {

        if (studentRepository.existsByEmail(email)) {
            throw new DuplicateResourceException(
                    "Email already registered."
            );
        }

        emailOtpRepository.deleteByEmailAndPurpose(
                email,
                OtpPurpose.REGISTER
        );

        String otp = generateOtp();

        EmailOtp emailOtp = EmailOtp.builder()
                .email(email)
                .otp(otp)
                .purpose(OtpPurpose.REGISTER)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        emailOtpRepository.save(emailOtp);

        emailService.sendOtpEmail(email, otp);

        return "OTP sent successfully.";
    }

    // ==========================================
    // VERIFY REGISTRATION OTP CODE
    // ==========================================

    @Override
    @Transactional
    public String verifyRegistrationOtpCode(
            String email,
            String otp
    ) {

        EmailOtp emailOtp = emailOtpRepository
                .findTopByEmailAndPurposeOrderByIdDesc(
                        email,
                        OtpPurpose.REGISTER
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "OTP not found."
                        )
                );

        // Check expiry
        if (LocalDateTime.now()
                .isAfter(emailOtp.getExpiresAt())) {

            throw new IllegalArgumentException(
                    "OTP expired. Please request a new OTP."
            );
        }

        // Check OTP
        if (!emailOtp.getOtp().equals(otp)) {

            throw new IllegalArgumentException(
                    "Invalid OTP."
            );
        }

        // Mark OTP as verified
        emailOtp.setVerified(true);

        emailOtpRepository.save(emailOtp);

        return "Email verified successfully.";
    }

    // ==========================================
    // VERIFY OTP + REGISTER
    // ==========================================

    @Override
    @Transactional
    public AuthResponse verifyRegistrationOtp(
            RegisterRequest request
    ) {

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "Passwords do not match."
            );
        }

        EmailOtp emailOtp = emailOtpRepository
                .findTopByEmailAndPurposeOrderByIdDesc(
                        request.getEmail(),
                        OtpPurpose.REGISTER
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Email verification not found."
                        )
                );

        // ==========================================
        // Email must already be verified
        // ==========================================

        if (!Boolean.TRUE.equals(emailOtp.getVerified())) {

            throw new IllegalArgumentException(
                    "Please verify your email before creating an account."
            );
        }

        // ==========================================
        // Prevent duplicate email
        // ==========================================

        if (studentRepository
                .existsByEmail(request.getEmail())) {

            throw new DuplicateResourceException(
                    "Email already registered."
            );
        }

        // ==========================================
        // Prevent duplicate roll number
        // ==========================================

        if (studentRepository
                .existsByRollNumber(
                        request.getRollNumber()
                )) {

            throw new DuplicateResourceException(
                    "Roll number already exists."
            );
        }

        // ==========================================
        // Create Student
        // ==========================================

        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .year(request.getYear())
                .section(request.getSection())
                .specialization(request.getSpecialization())
                .phone(request.getPhone())
                .emailVerified(true)
                .build();

        Student saved =
                studentRepository.save(student);

        // Remove OTP after successful registration
        emailOtpRepository.delete(emailOtp);

        String token =
                jwtService.generateToken(
                        new CustomUserDetails(saved)
                );

        return AuthResponse.builder()
                .studentId(saved.getId())
                .fullName(
                        saved.getFirstName()
                                + " "
                                + saved.getLastName()
                )
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .token(token)
                .message(
                        "Registration successful."
                )
                .build();
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Student student = studentRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found.")
                );

        String token = jwtService.generateToken(
                new CustomUserDetails(student)
        );

        return AuthResponse.builder()
                .studentId(student.getId())
                .fullName(student.getFirstName() + " " + student.getLastName())
                .email(student.getEmail())
                .role(student.getRole().name())
                .token(token)
                .message("Login successful.")
                .build();
    }

    // ==========================================
    // SEND FORGOT PASSWORD OTP
    // ==========================================

    @Override
    @Transactional
    public String sendForgotPasswordOtp(String email) {

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Email not registered.")
                );

        emailOtpRepository.deleteByEmailAndPurpose(
                email,
                OtpPurpose.FORGOT_PASSWORD
        );

        String otp = generateOtp();

        EmailOtp emailOtp = EmailOtp.builder()
                .email(student.getEmail())
                .otp(otp)
                .purpose(OtpPurpose.FORGOT_PASSWORD)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        emailOtpRepository.save(emailOtp);

        emailService.sendOtpEmail(email, otp);

        return "OTP sent successfully.";
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @Override
    @Transactional
    public String resetPassword(
            String email,
            String otp,
            String newPassword,
            String confirmPassword
    ) {

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        EmailOtp emailOtp = emailOtpRepository
                .findTopByEmailAndPurposeOrderByIdDesc(
                        email,
                        OtpPurpose.FORGOT_PASSWORD
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("OTP not found.")
                );

        if (LocalDateTime.now().isAfter(emailOtp.getExpiresAt())) {
            throw new IllegalArgumentException("OTP expired.");
        }

        if (!emailOtp.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found.")
                );

        student.setPassword(passwordEncoder.encode(newPassword));

        studentRepository.save(student);

        emailOtpRepository.delete(emailOtp);

        return "Password reset successful.";
    }
}