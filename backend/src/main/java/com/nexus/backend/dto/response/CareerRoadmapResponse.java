package com.nexus.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerRoadmapResponse {

    private Long id;

    private Long studentId;

    private String careerGoal;

    private String roadmap;

    private LocalDateTime generatedAt;

}