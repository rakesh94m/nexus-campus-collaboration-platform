package com.nexus.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSkillResponse {

    // =========================================
    // Project Skill ID
    // =========================================

    private Long id;

    // =========================================
    // Skill Information
    // =========================================

    private Long skillId;

    private String skillName;
}