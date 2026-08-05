package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.MatchResponse;
import com.nexus.backend.repository.MatchHistoryRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    private final MatchHistoryRepository matchHistoryRepository;
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;

    @Override
    public List<MatchResponse> getProjectMatches(Long studentId) {

        throw new UnsupportedOperationException("Matching engine will be implemented later.");

    }

}