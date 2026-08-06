package com.nexus.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long totalProjects;

    private Long totalSkills;

    private Long totalInterests;

    private Long totalAchievements;

    private Long totalCertifications;

    private Long totalGoals;

    private Long totalNotifications;

    private Long pendingRequests;

    private Long acceptedRequests;

    
    private Long totalRequestsSent;

    private Integer profileCompletion;

}