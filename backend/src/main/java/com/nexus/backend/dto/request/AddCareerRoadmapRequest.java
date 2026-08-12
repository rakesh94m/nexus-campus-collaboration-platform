package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddCareerRoadmapRequest {

    @NotNull(message = "Student ID is required.")
    private Long studentId;

    @NotBlank(message = "Career goal is required.")
    private String careerGoal;

    private String currentSkills;

    private String missingSkills;

    @NotBlank(message = "Roadmap is required.")
    private String roadmap;

    private String careerAdvice;

    private String recommendedCertifications;
}