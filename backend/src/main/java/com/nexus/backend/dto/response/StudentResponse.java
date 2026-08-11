package com.nexus.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;

    private String fullName;

    private String rollNumber;

    private String email;

    private String phoneNumber;

    private String branch;

    private String year;

    private String department;

    private String college;

    private String bio;

    private String profileImageUrl;

    private String linkedinUrl;

    private String githubUrl;

    private String role;

    private String accountStatus;

    private String availabilityStatus;
}