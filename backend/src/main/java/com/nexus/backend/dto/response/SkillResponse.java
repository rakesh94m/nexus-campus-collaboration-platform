package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.ProficiencyLevel;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillResponse {

    // StudentSkill ID
    private Long id;

    // Actual Skill ID
    private Long skillId;

    private String skillName;

    private ProficiencyLevel proficiency;
}