package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.ProficiencyLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillResponse {

    private Long id;

    private String skillName;

    private ProficiencyLevel proficiency;

}