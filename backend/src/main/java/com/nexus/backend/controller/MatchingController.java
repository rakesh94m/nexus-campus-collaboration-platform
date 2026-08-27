package com.nexus.backend.controller;

import com.nexus.backend.dto.response.GeminiRecommendationResponse;
import com.nexus.backend.dto.response.MatchResponse;
import com.nexus.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;


    // =========================================
    // GET SMART PROJECT MATCHES
    //
    // Java-based matching only.
    //
    // NO GEMINI API CALL.
    // =========================================

    @GetMapping("/projects")
    public List<MatchResponse> getProjectMatches() {

        return matchingService
                .getProjectMatches();
    }


    // =========================================
    // GENERATE AI RECOMMENDATION
    //
    // Gemini is called only when this
    // endpoint is requested.
    // =========================================

    @PostMapping("/projects/{projectId}/ai-recommendation")
    public GeminiRecommendationResponse
    generateProjectRecommendation(
            @PathVariable Long projectId) {

        return matchingService
                .generateProjectRecommendation(
                        projectId
                );
    }
}