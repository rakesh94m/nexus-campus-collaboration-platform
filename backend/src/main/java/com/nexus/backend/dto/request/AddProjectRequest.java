package com.nexus.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
    private String projectTitle;

    private String description;

    private String technologiesUsed;

    private String githubUrl;

    private String liveDemoUrl;

    private LocalDate startDate;

    private LocalDate endDate;

    // =========================================
    // Required Project Skills
    // =========================================

    @Valid
    private List<ProjectSkillRequest> requiredSkills;
}