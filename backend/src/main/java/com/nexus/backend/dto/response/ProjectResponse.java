package com.nexus.backend.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {

    // =========================================
    // Project Information
    // =========================================

    private Long id;

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

    private List<ProjectSkillResponse> requiredSkills;
}