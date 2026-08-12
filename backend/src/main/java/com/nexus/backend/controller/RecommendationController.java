package com.nexus.backend.controller;

import com.nexus.backend.dto.response.RecommendationResponse;
import com.nexus.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    // =========================================
    // Get AI Project Recommendations
    // =========================================

    @GetMapping("/projects")
    public List<RecommendationResponse> recommendProjects() {

        return recommendationService.recommendProjects();
    }
}