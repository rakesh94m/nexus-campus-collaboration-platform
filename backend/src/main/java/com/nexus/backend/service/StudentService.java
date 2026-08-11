package com.nexus.backend.service;

import com.nexus.backend.dto.request.UpdateAvailabilityRequest;
import com.nexus.backend.dto.request.UpdateProfileRequest;
import com.nexus.backend.dto.request.UpdateSocialLinksRequest;
import com.nexus.backend.dto.response.StudentProfileResponse;
import com.nexus.backend.dto.response.StudentResponse;

import java.util.List;

public interface StudentService {

    StudentProfileResponse getMyProfile();

    StudentProfileResponse updateProfile(
            UpdateProfileRequest request
    );

    StudentProfileResponse updateSocialLinks(
            UpdateSocialLinksRequest request
    );

    StudentProfileResponse updateAvailability(
            UpdateAvailabilityRequest request
    );

    // =====================================
    // Student Discovery
    // =====================================

    List<StudentResponse> getAllStudents();

    StudentResponse getStudentById(Long id);
}