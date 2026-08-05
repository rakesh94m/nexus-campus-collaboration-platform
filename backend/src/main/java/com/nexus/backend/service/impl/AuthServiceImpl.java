package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.LoginRequest;
import com.nexus.backend.dto.request.RegisterRequest;
import com.nexus.backend.dto.response.AuthResponse;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.security.CustomUserDetails;
import com.nexus.backend.security.JwtService;
import com.nexus.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered.");
        }

        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Roll number already exists.");
        }

        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .year(request.getYear())
                .section(request.getSection())
                .specialization(request.getSpecialization())
                .phone(request.getPhone())
                .build();

        Student savedStudent = studentRepository.save(student);

        String token = jwtService.generateToken(
                new CustomUserDetails(savedStudent)
        );

        return AuthResponse.builder()
                .studentId(savedStudent.getId())
                .fullName(savedStudent.getFirstName() + " " + savedStudent.getLastName())
                .email(savedStudent.getEmail())
                .role(savedStudent.getRole().name())
                .token(token)
                .message("Registration successful.")
                .build();
    }

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
                        new ResourceNotFoundException(
                                "Student not found."
                        ));

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

}