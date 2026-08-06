package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.DashboardResponse;
import com.nexus.backend.entity.enums.CollaborationStatus;
import com.nexus.backend.repository.*;
import com.nexus.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentInterestRepository studentInterestRepository;
    private final AchievementRepository achievementRepository;
    private final CertificationRepository certificationRepository;
    private final GoalRepository goalRepository;
    private final NotificationRepository notificationRepository;
    private final CollaborationRequestRepository collaborationRequestRepository;

    @Override
    public DashboardResponse getDashboard(Long studentId) {

        Long totalProjects = projectRepository.countByStudentId(studentId);

        Long totalSkills = studentSkillRepository.countByStudentId(studentId);

        Long totalInterests = studentInterestRepository.countByStudentId(studentId);

        Long totalAchievements = achievementRepository.countByStudentId(studentId);

        Long totalCertifications = certificationRepository.countByStudentId(studentId);

        Long totalGoals = goalRepository.countByStudentId(studentId);

        Long totalNotifications = notificationRepository.countByStudentId(studentId);

        Long pendingRequests =
                collaborationRequestRepository.countByReceiverIdAndStatus(
                        studentId,
                        CollaborationStatus.PENDING);

        Long acceptedRequests =
                collaborationRequestRepository.countByReceiverIdAndStatus(
                        studentId,
                        CollaborationStatus.ACCEPTED);
        
        Long totalRequestsSent =
                collaborationRequestRepository.countBySenderId(studentId);

        int profileCompletion = calculateProfileCompletion(
                totalSkills,
                totalInterests,
                totalProjects,
                totalAchievements,
                totalCertifications,
                totalGoals
        );

        return DashboardResponse.builder()
        .totalProjects(totalProjects)
        .totalSkills(totalSkills)
        .totalInterests(totalInterests)
        .totalAchievements(totalAchievements)
        .totalCertifications(totalCertifications)
        .totalGoals(totalGoals)
        .totalNotifications(totalNotifications)
        .pendingRequests(pendingRequests)
        .acceptedRequests(acceptedRequests)
        .totalRequestsSent(totalRequestsSent)   
        .profileCompletion(profileCompletion)
        .build();
    }

    private int calculateProfileCompletion(
            Long skills,
            Long interests,
            Long projects,
            Long achievements,
            Long certifications,
            Long goals) {

        int score = 0;

        if (skills > 0) score += 20;
        if (interests > 0) score += 15;
        if (projects > 0) score += 25;
        if (achievements > 0) score += 15;
        if (certifications > 0) score += 15;
        if (goals > 0) score += 10;

        return score;
    }

}