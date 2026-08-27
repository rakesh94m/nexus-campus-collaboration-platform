package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.MatchType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchHistoryResponse {

    private Long id;

    private Long studentId;

    private String studentName;

    private Long projectId;

    private String projectTitle;

    private MatchType matchType;

    private Double matchScore;

    private LocalDateTime matchedAt;

}