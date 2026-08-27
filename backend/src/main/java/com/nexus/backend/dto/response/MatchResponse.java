package com.nexus.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {

    private Long matchId;

    private Long studentId;

    private Long projectId;

    private String projectTitle;

    private String technologiesUsed;

    private String matchType;

    private Double matchScore;

    private LocalDateTime matchedAt;
}