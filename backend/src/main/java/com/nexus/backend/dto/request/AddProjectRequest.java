package com.nexus.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddProjectRequest {

    // =========================================
    // Project Information
    // =========================================

    @NotBlank(message = "Project title is required.")
    @Size(max = 150, message = "Project title cannot exceed 150 characters.")
    private String projectTitle;

    // F-22: Added @Size to prevent unbounded text inputs
    @Size(max = 5000, message = "Description cannot exceed 5000 characters.")
    private String description;

    @Size(max = 300, message = "Technologies used cannot exceed 300 characters.")
    private String technologiesUsed;

    // F-22: URL pattern — must start with http:// or https:// (or be empty)
    @Pattern(
            regexp = "^$|^https?://.*",
            message = "GitHub URL must be a valid URL starting with http:// or https://."
    )
    @Size(max = 300, message = "GitHub URL cannot exceed 300 characters.")
    private String githubUrl;

    @Pattern(
            regexp = "^$|^https?://.*",
            message = "Live demo URL must be a valid URL starting with http:// or https://."
    )
    @Size(max = 300, message = "Live demo URL cannot exceed 300 characters.")
    private String liveDemoUrl;

    private LocalDate startDate;

    private LocalDate endDate;

    // =========================================
    // Required Project Skills
    // =========================================

    @Valid
    private List<ProjectSkillRequest> requiredSkills;
}