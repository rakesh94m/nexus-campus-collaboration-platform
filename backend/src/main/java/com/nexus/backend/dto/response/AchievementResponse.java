package com.nexus.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AchievementResponse {

    private Long id;

    private String title;

    private String description;

    private String issuer;

    private LocalDate achievementDate;

    private String certificateUrl;

}