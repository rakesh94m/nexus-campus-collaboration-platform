package com.nexus.backend.dto.response;

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
public class GeminiRecommendationResponse {

    private String reason;

    private String missingSkills;

    private String learningRoadmap;

    private String careerAdvice;

    private String recommendedCertification;
}