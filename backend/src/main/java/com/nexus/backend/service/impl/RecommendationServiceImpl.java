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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
    private final MatchHistoryRepository matchHistoryRepository;
    private final MatchScoreCalculator matchScoreCalculator;
    private final GeminiService geminiService;

    @Override
    public List<RecommendationResponse> recommendProjects(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));

        // Phase 1: Calculate scores only
        List<RecommendationResponse> recommendations = projectRepository.findAll()
                .stream()
                .map(project -> RecommendationResponse.builder()
                        .project(project)
                        .projectId(project.getId())
                        .projectTitle(project.getProjectTitle())
                        .technologiesUsed(project.getTechnologiesUsed())
                        .matchScore(matchScoreCalculator.calculate(student, project))
                        .build())
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .limit(3)
                .toList();

        // Phase 2: Save MatchHistory + Call Gemini only for Top 3
        recommendations.forEach(recommendation -> {

            Project project = recommendation.getProject();

            MatchHistory history = matchHistoryRepository
                    .findByStudentAndProject(student, project)
                    .orElse(
                            MatchHistory.builder()
                                    .student(student)
                                    .project(project)
                                    .matchType(MatchType.STUDENT_TO_PROJECT)
                                    .build()
                    );

            history.setMatchScore(recommendation.getMatchScore());

            matchHistoryRepository.save(history);

            GeminiRecommendationResponse geminiResponse =
                    geminiService.generateRecommendation(
                            student,
                            project,
                            recommendation.getMatchScore()
                    );

            recommendation.setReason(geminiResponse.getReason());
            recommendation.setMissingSkills(geminiResponse.getMissingSkills());
            recommendation.setLearningRoadmap(geminiResponse.getLearningRoadmap());
            recommendation.setCareerAdvice(geminiResponse.getCareerAdvice());
            
            // Setting the new certification field!
            recommendation.setRecommendedCertification(geminiResponse.getRecommendedCertification());

        });

        return recommendations;
    }
}