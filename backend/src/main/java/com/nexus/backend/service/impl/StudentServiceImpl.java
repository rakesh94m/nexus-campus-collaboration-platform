package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.UpdateAvailabilityRequest;
import com.nexus.backend.dto.request.UpdateProfileRequest;
import com.nexus.backend.dto.request.UpdateSocialLinksRequest;
import com.nexus.backend.dto.response.StudentProfileResponse;
import com.nexus.backend.entity.Student;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    // ===============================
    // Get Logged-in Student
    // ===============================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Student not found."));
    }

    // ===============================
    // Entity -> DTO Mapper
    // ===============================

    private StudentProfileResponse mapToResponse(Student student) {

        return StudentProfileResponse.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .rollNumber(student.getRollNumber())
                .department(student.getDepartment())
                .year(student.getYear())
                .section(student.getSection())
                .specialization(student.getSpecialization())
                .cgpa(student.getCgpa())
                .phone(student.getPhone())
                .bio(student.getBio())
                .profilePhoto(student.getProfilePhoto())
                .resumeUrl(student.getResumeUrl())
                .githubUrl(student.getGithubUrl())
                .linkedinUrl(student.getLinkedinUrl())
                .availabilityStatus(student.getAvailabilityStatus())
                .accountStatus(student.getAccountStatus())
                .role(student.getRole())
                .build();
    }

    // ===============================
    // Get Profile
    // ===============================

    @Override
    public StudentProfileResponse getMyProfile() {

        Student student = getCurrentStudent();

        return mapToResponse(student);
    }

    // ===============================
    // Update Profile
    // ===============================

    @Override
    public StudentProfileResponse updateProfile(UpdateProfileRequest request) {

        Student student = getCurrentStudent();

        student.setBio(request.getBio());
        student.setCgpa(request.getCgpa());
        student.setPhone(request.getPhone());
        student.setSection(request.getSection());
        student.setSpecialization(request.getSpecialization());

        studentRepository.save(student);

        return mapToResponse(student);
    }

    // ===============================
    // Update Social Links
    // ===============================

    @Override
    public StudentProfileResponse updateSocialLinks(UpdateSocialLinksRequest request) {

        Student student = getCurrentStudent();

        student.setGithubUrl(request.getGithubUrl());
        student.setLinkedinUrl(request.getLinkedinUrl());
        student.setResumeUrl(request.getResumeUrl());

        studentRepository.save(student);

        return mapToResponse(student);
    }

    // ===============================
    // Update Availability
    // ===============================

    @Override
    public StudentProfileResponse updateAvailability(UpdateAvailabilityRequest request) {

        Student student = getCurrentStudent();

        student.setAvailabilityStatus(request.getAvailabilityStatus());

        studentRepository.save(student);

        return mapToResponse(student);
    }
}