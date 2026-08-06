package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.MatchType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMatchHistoryRequest {

    @NotNull(message = "Student ID is required.")
    private Long studentId;

    private Long projectId;

    @NotNull(message = "Match type is required.")
    private MatchType matchType;

    @NotNull(message = "Match score is required.")
    private Double matchScore;

}