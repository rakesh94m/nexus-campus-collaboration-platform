package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.GeminiRecommendationResponse;
import com.nexus.backend.dto.response.RecommendationResponse;
import com.nexus.backend.entity.MatchHistory;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.MatchType;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.MatchHistoryRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.GeminiService;
import com.nexus.backend.service.RecommendationService;
import com.nexus.backend.util.MatchScoreCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl
        implements RecommendationService {

    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
    private final MatchHistoryRepository matchHistoryRepository;
    private final MatchScoreCalculator matchScoreCalculator;
    private final GeminiService geminiService;

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

    // =========================================
    // Get AI Project Recommendations
    // =========================================

    @Override
    @Transactional
    public List<RecommendationResponse> recommendProjects() {

        Student student = getCurrentStudent();

        // =========================================
        // Find all projects
        // =========================================

        List<RecommendationResponse> recommendations =
                projectRepository
                        .findAll()
                        .stream()

                        // Don't recommend the student's own projects
                        .filter(project ->
                                !project.getStudent()
                                        .getId()
                                        .equals(student.getId())
                        )

                        // Calculate match score
                        .map(project ->
                                RecommendationResponse.builder()
                                        .projectId(project.getId())
                                        .projectTitle(
                                                project.getProjectTitle()
                                        )
                                        .technologiesUsed(
                                                project.getTechnologiesUsed()
                                        )
                                        .matchScore(
                                                matchScoreCalculator
                                                        .calculate(
                                                                student,
                                                                project
                                                        )
                                        )
                                        .project(project)
                                        .build()
                        )

                        // Highest score first
                        .sorted(
                                (a, b) ->
                                        Double.compare(
                                                b.getMatchScore(),
                                                a.getMatchScore()
                                        )
                        )

                        // Only top 3
                        .limit(3)

                        .toList();

        // =========================================
        // Process Top Recommendations
        // =========================================

        recommendations.forEach(recommendation -> {

            Project project =
                    recommendation.getProject();

            // =========================================
            // Save / Update Match History
            // =========================================

            MatchHistory history =
                    matchHistoryRepository
                            .findByStudentAndProject(
                                    student,
                                    project
                            )
                            .orElse(
                                    MatchHistory.builder()
                                            .student(student)
                                            .project(project)
                                            .matchType(
                                                    MatchType.STUDENT_TO_PROJECT
                                            )
                                            .build()
                            );

            history.setMatchScore(
                    recommendation.getMatchScore()
            );

            matchHistoryRepository.save(history);

            // =========================================
            // Generate Gemini Recommendation
            // =========================================

            GeminiRecommendationResponse geminiResponse =
                    geminiService.generateRecommendation(
                            student,
                            project,
                            recommendation.getMatchScore()
                    );

            // =========================================
            // Add Gemini Data To Response
            // =========================================

            recommendation.setReason(
                    geminiResponse.getReason()
            );

            recommendation.setMissingSkills(
                    geminiResponse.getMissingSkills()
            );

            recommendation.setLearningRoadmap(
                    geminiResponse.getLearningRoadmap()
            );

            recommendation.setCareerAdvice(
                    geminiResponse.getCareerAdvice()
            );

            recommendation.setRecommendedCertification(
                    geminiResponse
                            .getRecommendedCertification()
            );
        });

        return recommendations;
    }
}