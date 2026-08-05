package com.nexus.backend.controller;

import com.nexus.backend.dto.request.UpdateAvailabilityRequest;
import com.nexus.backend.dto.request.UpdateProfileRequest;
import com.nexus.backend.dto.request.UpdateSocialLinksRequest;
import com.nexus.backend.dto.response.StudentProfileResponse;
import com.nexus.backend.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // =====================================
    // Get Logged-in Student Profile
    // =====================================

    @GetMapping("/me")
    public StudentProfileResponse getMyProfile() {

        return studentService.getMyProfile();

    }

    // =====================================
    // Update Basic Profile
    // =====================================

    @PutMapping("/profile")
    public StudentProfileResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        return studentService.updateProfile(request);

    }

    // =====================================
    // Update Social Links
    // =====================================

    @PutMapping("/social-links")
    public StudentProfileResponse updateSocialLinks(
            @Valid @RequestBody UpdateSocialLinksRequest request
    ) {

        return studentService.updateSocialLinks(request);

    }

    // =====================================
    // Update Availability
    // =====================================

    @PutMapping("/availability")
    public StudentProfileResponse updateAvailability(
            @Valid @RequestBody UpdateAvailabilityRequest request
    ) {

        return studentService.updateAvailability(request);

    }

}