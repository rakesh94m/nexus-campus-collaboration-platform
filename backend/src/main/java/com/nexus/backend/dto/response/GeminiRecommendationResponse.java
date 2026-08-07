package com.nexus.backend.dto.response;

import lombok.*;

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