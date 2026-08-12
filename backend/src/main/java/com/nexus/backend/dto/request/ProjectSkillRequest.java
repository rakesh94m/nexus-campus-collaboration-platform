package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.SkillImportance;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSkillRequest {

    // =========================================
    // Skill ID
    // =========================================

    @NotNull(message = "Skill ID is required.")
    private Long skillId;

    // =========================================
    // Skill Importance
    // =========================================

    @NotNull(message = "Skill importance is required.")
    private SkillImportance importance;
}