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

    private Long projectId;

    private MatchType matchType;

    private Double matchScore;

    private LocalDateTime matchedAt;

}