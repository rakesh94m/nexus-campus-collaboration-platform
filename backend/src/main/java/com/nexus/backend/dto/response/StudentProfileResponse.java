package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.AccountStatus;
import com.nexus.backend.entity.enums.AvailabilityStatus;
import com.nexus.backend.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentProfileResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String rollNumber;

    private String department;

    private Integer year;

    private String section;

    private String specialization;

    private Double cgpa;

    private String phone;

    private String bio;

    private String profilePhoto;

    private String resumeUrl;

    private String githubUrl;

    private String linkedinUrl;

    private AvailabilityStatus availabilityStatus;

    private AccountStatus accountStatus;

    private Role role;
}