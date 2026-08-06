package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCareerRoadmapRequest {

    @NotBlank(message = "Career goal is required.")
    private String careerGoal;

    @NotBlank(message = "Roadmap is required.")
    private String roadmap;

}