package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddMatchHistoryRequest;
import com.nexus.backend.dto.request.UpdateMatchHistoryRequest;
import com.nexus.backend.dto.response.MatchHistoryResponse;
import com.nexus.backend.entity.MatchHistory;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.MatchHistoryRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.MatchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchHistoryServiceImpl
        implements MatchHistoryService {

    private final MatchHistoryRepository matchHistoryRepository;
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return studentRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found."
                        ));
    }

    // =========================================
    // Create Match History
    // =========================================

    @Override
    public MatchHistoryResponse createMatchHistory(
            AddMatchHistoryRequest request) {

        Student student =
                studentRepository
                        .findById(
                                request.getStudentId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found."
                                ));

        Project project = null;

        if (request.getProjectId() != null) {

            project =
                    projectRepository
                            .findById(
                                    request.getProjectId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Project not found."
                                    ));
        }

        MatchHistory matchHistory =
                MatchHistory.builder()
                        .student(student)
                        .project(project)
                        .matchType(
                                request.getMatchType()
                        )
                        .matchScore(
                                request.getMatchScore()
                        )
                        .build();

        matchHistory =
                matchHistoryRepository.save(
                        matchHistory
                );

        return mapToResponse(
                matchHistory
        );
    }

    // =========================================
    // Get Match History
    // ONLY FOR LOGGED-IN STUDENT
    // =========================================

    @Override
    public List<MatchHistoryResponse>
    getAllMatchHistory() {

        Student currentStudent =
                getCurrentStudent();

        return matchHistoryRepository
                .findByStudent(currentStudent)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Get Match History By ID
    // ONLY OWNER CAN ACCESS
    // =========================================

    @Override
    public MatchHistoryResponse
    getMatchHistoryById(Long id) {

        Student currentStudent =
                getCurrentStudent();

        MatchHistory matchHistory =
                matchHistoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Match history not found."
                                ));

        // =========================================
        // Authorization Check
        // =========================================

        if (!matchHistory.getStudent()
                .getId()
                .equals(currentStudent.getId())) {

            throw new ResourceNotFoundException(
                    "Match history not found."
            );
        }

        return mapToResponse(
                matchHistory
        );
    }

    // =========================================
    // Update Match History
    // ONLY OWNER CAN UPDATE
    // =========================================

    @Override
    public MatchHistoryResponse updateMatchHistory(
            Long id,
            UpdateMatchHistoryRequest request) {

        Student currentStudent =
                getCurrentStudent();

        MatchHistory matchHistory =
                matchHistoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Match history not found."
                                ));

        // =========================================
        // Authorization Check
        // =========================================

        if (!matchHistory.getStudent()
                .getId()
                .equals(currentStudent.getId())) {

            throw new ResourceNotFoundException(
                    "Match history not found."
            );
        }

        Project project = null;

        if (request.getProjectId() != null) {

            project =
                    projectRepository
                            .findById(
                                    request.getProjectId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Project not found."
                                    ));
        }

        matchHistory.setProject(project);

        matchHistory.setMatchType(
                request.getMatchType()
        );

        matchHistory.setMatchScore(
                request.getMatchScore()
        );

        matchHistory =
                matchHistoryRepository.save(
                        matchHistory
                );

        return mapToResponse(
                matchHistory
        );
    }

    // =========================================
    // Delete Match History
    // ONLY OWNER CAN DELETE
    // =========================================

    @Override
    public void deleteMatchHistory(Long id) {

        Student currentStudent =
                getCurrentStudent();

        MatchHistory matchHistory =
                matchHistoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Match history not found."
                                ));

        // =========================================
        // Authorization Check
        // =========================================

        if (!matchHistory.getStudent()
                .getId()
                .equals(currentStudent.getId())) {

            throw new ResourceNotFoundException(
                    "Match history not found."
            );
        }

        matchHistoryRepository.delete(
                matchHistory
        );
    }

    // =========================================
    // Mapper
    // =========================================

    private MatchHistoryResponse mapToResponse(
            MatchHistory matchHistory) {

        Student student =
                matchHistory.getStudent();

        Project project =
                matchHistory.getProject();

        return MatchHistoryResponse.builder()

                .id(
                        matchHistory.getId()
                )

                // =================================
                // Student
                // =================================

                .studentId(
                        student != null
                                ? student.getId()
                                : null
                )

                .studentName(
                        student != null
                                ? student.getFirstName()
                                + " "
                                + student.getLastName()
                                : null
                )

                // =================================
                // Project
                // =================================

                .projectId(
                        project != null
                                ? project.getId()
                                : null
                )

                .projectTitle(
                        project != null
                                ? project.getProjectTitle()
                                : null
                )

                // =================================
                // Match Information
                // =================================

                .matchType(
                        matchHistory.getMatchType()
                )

                .matchScore(
                        matchHistory.getMatchScore()
                )

                .matchedAt(
                        matchHistory.getMatchedAt()
                )

                .build();
    }
}