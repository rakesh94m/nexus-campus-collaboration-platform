package com.nexus.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nexus.backend.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    // =========================================
    // Gemini AI Output
    // =========================================

    private String reason;

    private String missingSkills;

    private String learningRoadmap;

    private String careerAdvice;

    private String recommendedCertification;

    // =========================================
    // Internal Project Object
    // =========================================

    @JsonIgnore
    private Project project;
}