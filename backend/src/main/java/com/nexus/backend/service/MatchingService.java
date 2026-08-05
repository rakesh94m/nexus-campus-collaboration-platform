package com.nexus.backend.service;

import com.nexus.backend.dto.response.MatchResponse;

import java.util.List;

public interface MatchingService {

    List<MatchResponse> getProjectMatches(Long studentId);

}