package com.nexus.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileUpdateRequest {

    @Size(max = 100)
    private String fullName;

    @Email(message = "Enter a valid email")
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 50)
    private String branch;

    @Size(max = 20)
    private String year;

    @Size(max = 100)
    private String department;

    @Size(max = 100)
    private String college;

    @Size(max = 255)
    private String profileImageUrl;

    @Size(max = 500)
    private String bio;

    @Size(max = 255)
    private String linkedinUrl;

    @Size(max = 255)
    private String githubUrl;

}