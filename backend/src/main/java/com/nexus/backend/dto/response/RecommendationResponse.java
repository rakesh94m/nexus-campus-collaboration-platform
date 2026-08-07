package com.nexus.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nexus.backend.entity.Project;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {

    private Long projectId;

    private String projectTitle;

    private String technologiesUsed;

    private Double matchScore;

    // Gemini Output
    private String reason;

    private String missingSkills;

    private String learningRoadmap;

    private String careerAdvice;

    // Internal relationship for quick access (Hidden from Postman/Frontend)
    @JsonIgnore
    private Project project;
    private String recommendedCertification;
}