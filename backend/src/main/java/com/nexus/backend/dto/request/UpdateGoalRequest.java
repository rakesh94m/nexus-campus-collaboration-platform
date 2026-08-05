package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.GoalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateGoalRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private GoalStatus status;

}