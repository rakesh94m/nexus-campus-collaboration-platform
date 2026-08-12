package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.SkillImportance;
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

    // =========================================
    // Importance
    // =========================================

    private SkillImportance importance;
}