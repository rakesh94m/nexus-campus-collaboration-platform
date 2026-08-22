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
    // Owner Information
    // =========================================

    private Long ownerId;

    private String ownerName;

    private String ownerDepartment;

    private Integer ownerYear;

    // =========================================
    // Team Information
    // =========================================

    private Integer teamMemberCount;

    // =========================================
    // Required Project Skills
    // =========================================

    private List<ProjectSkillResponse> requiredSkills;
}