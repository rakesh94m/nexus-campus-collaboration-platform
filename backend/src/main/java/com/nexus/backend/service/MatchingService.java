package com.nexus.backend.service;

import com.nexus.backend.dto.response.GeminiRecommendationResponse;
import com.nexus.backend.dto.response.MatchResponse;

import java.util.List;

public interface MatchingService {

    // =========================================
    // Get Smart Project Matches
    // Java-based skill matching
    // =========================================

    List<MatchResponse> getProjectMatches();

    // =========================================
    // Generate AI Recommendation
    // for one selected project
    // =========================================

    GeminiRecommendationResponse
    generateProjectRecommendation(Long projectId);
}