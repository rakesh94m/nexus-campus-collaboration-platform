package com.nexus.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeminiCareerRoadmapResponse {

    private String careerGoal;

    private String currentSkills;

    private String missingSkills;

    private String roadmap;

    private String careerAdvice;

    private String recommendedCertifications;
}