package com.nexus.backend.service;

import com.nexus.backend.dto.response.MatchResponse;

import java.util.List;

public interface MatchingService {

    // =========================================
    // Get AI Recommended Projects
    // for logged-in student
    // =========================================

    List<MatchResponse> getProjectMatches();

}