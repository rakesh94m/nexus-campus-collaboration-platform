package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.ProficiencyLevel;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSkillRequest {

    @NotNull(message = "Proficiency is required.")
    private ProficiencyLevel proficiency;

}