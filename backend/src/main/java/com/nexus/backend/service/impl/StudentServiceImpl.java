package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.ChangePasswordRequest;
import com.nexus.backend.dto.request.UpdateAvailabilityRequest;
import com.nexus.backend.dto.request.UpdateProfileRequest;
import com.nexus.backend.dto.request.UpdateSocialLinksRequest;
import com.nexus.backend.dto.response.StudentProfileResponse;
import com.nexus.backend.dto.response.StudentResponse;
import com.nexus.backend.entity.Student;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.repository.StudentSkillRepository;
import com.nexus.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentSkillRepository studentSkillRepository;

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
    // Student Discovery Mapper
    // ===============================

    private StudentResponse mapToStudentResponse(Student student) {

        List<String> skills = studentSkillRepository
                .findByStudent(student)
                .stream()
                .map(studentSkill -> studentSkill.getSkill().getSkillName())
                .toList();

        return StudentResponse.builder()
                .id(student.getId())
                .fullName(student.getFirstName() + " " + student.getLastName())
                .rollNumber(student.getRollNumber())
                .email(student.getEmail())

                // Phone removed
                .branch(student.getSpecialization())

                .year(student.getYear() != null
                        ? student.getYear().toString()
                        : null)

                .department(student.getDepartment())
                .bio(student.getBio())
                .profileImageUrl(student.getProfilePhoto())
                .linkedinUrl(student.getLinkedinUrl())
                .githubUrl(student.getGithubUrl())

                .role(student.getRole() != null
                        ? student.getRole().name()
                        : null)

                .accountStatus(student.getAccountStatus() != null
                        ? student.getAccountStatus().name()
                        : null)

                .availabilityStatus(student.getAvailabilityStatus() != null
                        ? student.getAvailabilityStatus().name()
                        : null)

                .skills(skills)

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

    // ===============================
    // Change Password
    // ===============================

    @Override
    public void changePassword(ChangePasswordRequest request) {

        Student student = getCurrentStudent();

        // Verify current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                student.getPassword())) {

            throw new RuntimeException("Current password is incorrect.");
        }

        // Check confirmation
        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException("New passwords do not match.");
        }

        // Prevent same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                student.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from current password."
            );
        }

        // Save encrypted password
        student.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        studentRepository.save(student);
    }

    // ===============================
    // Get All Students
    // ===============================

    @Override
    public List<StudentResponse> getAllStudents() {

        Student currentStudent = getCurrentStudent();

        return studentRepository.findAll()
                .stream()
                .filter(student ->
                        !student.getId().equals(currentStudent.getId()))
                .map(this::mapToStudentResponse)
                .toList();
    }

    // ===============================
    // Get Student By ID
    // ===============================

    @Override
    public StudentResponse getStudentById(Long id) {

        Student currentStudent = getCurrentStudent();

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found."));

        if (student.getId().equals(currentStudent.getId())) {
            throw new RuntimeException(
                    "You cannot view yourself in student discovery."
            );
        }

        return mapToStudentResponse(student);
    }
}