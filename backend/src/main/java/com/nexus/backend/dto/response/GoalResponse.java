package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.GoalStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalResponse {

    private Long id;

    private String title;

    private String description;

    private GoalStatus status;

}