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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchHistoryServiceImpl implements MatchHistoryService {

    private final MatchHistoryRepository matchHistoryRepository;
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;

    @Override
    public MatchHistoryResponse createMatchHistory(AddMatchHistoryRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));

        Project project = null;

        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Project not found."));
        }

        MatchHistory matchHistory = MatchHistory.builder()
                .student(student)
                .project(project)
                .matchType(request.getMatchType())
                .matchScore(request.getMatchScore())
                .build();

        matchHistory = matchHistoryRepository.save(matchHistory);

        return mapToResponse(matchHistory);
    }

    @Override
    public List<MatchHistoryResponse> getAllMatchHistory() {

        return matchHistoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public MatchHistoryResponse getMatchHistoryById(Long id) {

        MatchHistory matchHistory = matchHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Match history not found."));

        return mapToResponse(matchHistory);
    }

    @Override
    public MatchHistoryResponse updateMatchHistory(Long id,
                                                   UpdateMatchHistoryRequest request) {

        MatchHistory matchHistory = matchHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Match history not found."));

        Project project = null;

        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Project not found."));
        }

        matchHistory.setProject(project);
        matchHistory.setMatchType(request.getMatchType());
        matchHistory.setMatchScore(request.getMatchScore());

        matchHistory = matchHistoryRepository.save(matchHistory);

        return mapToResponse(matchHistory);
    }

    @Override
    public void deleteMatchHistory(Long id) {

        MatchHistory matchHistory = matchHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Match history not found."));

        matchHistoryRepository.delete(matchHistory);
    }

    private MatchHistoryResponse mapToResponse(MatchHistory matchHistory) {

        return MatchHistoryResponse.builder()
                .id(matchHistory.getId())
                .studentId(matchHistory.getStudent().getId())
                .projectId(matchHistory.getProject() != null
                        ? matchHistory.getProject().getId()
                        : null)
                .matchType(matchHistory.getMatchType())
                .matchScore(matchHistory.getMatchScore())
                .matchedAt(matchHistory.getMatchedAt())
                .build();
    }

}