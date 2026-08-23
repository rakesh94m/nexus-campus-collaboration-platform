package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.MatchResponse;
import com.nexus.backend.entity.MatchHistory;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.ProjectSkill;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentSkill;
import com.nexus.backend.entity.enums.MatchType;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.MatchHistoryRepository;
import com.nexus.backend.repository.ProjectMemberRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    private final MatchHistoryRepository matchHistoryRepository;
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

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
    // Get AI Recommended Projects
    // =========================================

    @Override
    @Transactional
    public List<MatchResponse> getProjectMatches() {

        Student student = getCurrentStudent();

        // -----------------------------------------
        // Get all projects
        // -----------------------------------------

        List<Project> projects =
                projectRepository.findAll();

        List<MatchResponse> matches =
                new ArrayList<>();

        // -----------------------------------------
        // Calculate match for every project
        // -----------------------------------------

        for (Project project : projects) {

            // Do not recommend own project
            if (project.getStudent() != null
                    && project.getStudent()
                    .getId()
                    .equals(student.getId())) {

                continue;
            }

            // Do not recommend projects where
            // student is already a member
            boolean alreadyMember =
                    projectMemberRepository
                            .existsByProjectAndStudent(
                                    project,
                                    student
                            );

            if (alreadyMember) {
                continue;
            }

            // -----------------------------------------
            // Calculate score
            // -----------------------------------------

            double score =
                    calculateMatchScore(
                            student,
                            project
                    );

            // -----------------------------------------
            // Only recommend projects with
            // at least one matching skill
            // -----------------------------------------

            if (score <= 0) {
                continue;
            }

            // -----------------------------------------
            // Save / update match history
            // -----------------------------------------

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

            history.setMatchType(
                    MatchType.STUDENT_TO_PROJECT
            );

            history.setMatchScore(score);

            matchHistoryRepository.save(history);

            // -----------------------------------------
            // Build response
            // -----------------------------------------

            MatchResponse response =
                    MatchResponse.builder()
                            .matchId(history.getId())
                            .studentId(student.getId())
                            .projectId(project.getId())
                            .projectTitle(
                                    project.getProjectTitle()
                            )
                            .matchType(
                                    MatchType
                                            .STUDENT_TO_PROJECT
                                            .name()
                            )
                            .matchScore(score)
                            .matchedAt(
                                    history.getMatchedAt()
                            )
                            .build();

            matches.add(response);
        }

        // -----------------------------------------
        // Highest match first
        // -----------------------------------------

        matches.sort(
                Comparator.comparing(
                        MatchResponse::getMatchScore,
                        Comparator.reverseOrder()
                )
        );

        return matches;
    }

    // =========================================
    // Calculate Match Score
    // =========================================

    private double calculateMatchScore(
            Student student,
            Project project
    ) {

        List<StudentSkill> studentSkills =
                student.getStudentSkills();

        if (studentSkills == null
                || studentSkills.isEmpty()) {

            return 0.0;
        }

        List<ProjectSkill> projectSkills =
                project.getProjectSkills();

        if (projectSkills == null
                || projectSkills.isEmpty()) {

            return 0.0;
        }

        // -----------------------------------------
        // Create map:
        // Skill ID -> StudentSkill
        // -----------------------------------------

        Map<Long, StudentSkill> studentSkillMap =
                studentSkills
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(skill ->
                                skill.getSkill() != null
                        )
                        .collect(
                                Collectors.toMap(
                                        skill ->
                                                skill.getSkill()
                                                        .getId(),
                                        Function.identity(),
                                        (first, second) -> first
                                )
                        );

        int totalRequiredSkills = 0;
        int matchedSkills = 0;

        // -----------------------------------------
        // Compare required project skills
        // with student's skills
        // -----------------------------------------

        for (ProjectSkill projectSkill :
                projectSkills) {

            if (projectSkill == null
                    || projectSkill.getSkill() == null) {

                continue;
            }

            Long skillId =
                    projectSkill
                            .getSkill()
                            .getId();

            totalRequiredSkills++;

            // -----------------------------------------
            // Skill exists in student's profile
            // -----------------------------------------

            if (studentSkillMap.containsKey(skillId)) {

                matchedSkills++;
            }
        }

        if (totalRequiredSkills == 0) {
            return 0.0;
        }

        // -----------------------------------------
        // Skill Match Percentage
        //
        // Example:
        // Project requires:
        // Python, React, Java
        //
        // Student has:
        // Python, React
        //
        // Score = 2 / 3 * 100
        //       = 66.67
        // -----------------------------------------

        double score =
                ((double) matchedSkills
                        / totalRequiredSkills)
                        * 100.0;

        return Math.round(score * 100.0)
                / 100.0;
    }
}