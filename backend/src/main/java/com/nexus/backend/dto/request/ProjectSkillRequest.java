package com.nexus.backend.dto.request;

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
}