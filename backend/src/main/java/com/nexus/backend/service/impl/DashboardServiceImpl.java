package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.DashboardResponse;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.CollaborationStatus;
import com.nexus.backend.entity.enums.NotificationStatus;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.exception.UnauthorizedException;
import com.nexus.backend.repository.*;
import com.nexus.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentInterestRepository studentInterestRepository;
    private final AchievementRepository achievementRepository;
    private final CertificationRepository certificationRepository;
    private final GoalRepository goalRepository;
    private final NotificationRepository notificationRepository;
    private final CollaborationRequestRepository collaborationRequestRepository;
    private final StudentRepository studentRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return studentRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found."
                        ));
    }

    @Override
    public DashboardResponse getDashboard(Long studentId) {

        // =========================================
        // Bug #1 — IDOR fix:
        // Verify the requested studentId belongs
        // to the currently authenticated user.
        // =========================================

        Student currentStudent = getCurrentStudent();

        if (!currentStudent.getId().equals(studentId)) {
            throw new UnauthorizedException(
                    "You are not authorised to view this dashboard."
            );
        }

        // =========================================
        // Bug #7 — totalProjects fix:
        // Count both owned projects AND joined
        // project memberships.
        // =========================================

        Long ownedProjects = projectRepository.countByStudentId(studentId);

        Long joinedProjects = projectMemberRepository.countByStudentId(studentId);

        Long totalProjects = ownedProjects + joinedProjects;

        Long totalSkills = studentSkillRepository.countByStudentId(studentId);

        Long totalInterests = studentInterestRepository.countByStudentId(studentId);

        Long totalAchievements = achievementRepository.countByStudentId(studentId);

        Long totalCertifications = certificationRepository.countByStudentId(studentId);

        Long totalGoals = goalRepository.countByStudentId(studentId);

        // =========================================
        // Bug #9 — notification count fix:
        // Count only UNREAD notifications.
        // =========================================

        Long totalNotifications =
                notificationRepository.countByStudentIdAndStatus(
                        studentId,
                        NotificationStatus.UNREAD
                );

        Long pendingRequests =
                collaborationRequestRepository.countByReceiverIdAndStatus(
                        studentId,
                        CollaborationStatus.PENDING);

        // =========================================
        // Bug #17 — acceptedRequests fix:
        // Count accepted requests where the student
        // is the receiver OR the sender.
        // =========================================

        Long acceptedAsReceiver =
                collaborationRequestRepository.countByReceiverIdAndStatus(
                        studentId,
                        CollaborationStatus.ACCEPTED);

        Long acceptedAsSender =
                collaborationRequestRepository.countBySenderIdAndStatus(
                        studentId,
                        CollaborationStatus.ACCEPTED);

        Long acceptedRequests = acceptedAsReceiver + acceptedAsSender;

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