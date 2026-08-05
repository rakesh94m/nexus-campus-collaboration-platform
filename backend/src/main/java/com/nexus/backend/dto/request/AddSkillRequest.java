package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.ProficiencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddSkillRequest {

    @NotBlank(message = "Skill name is required.")
    private String skillName;

    @NotNull(message = "Proficiency is required.")
    private ProficiencyLevel proficiency;

}