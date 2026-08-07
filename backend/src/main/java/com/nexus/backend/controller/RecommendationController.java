package com.nexus.backend.controller;

import com.nexus.backend.dto.response.RecommendationResponse;
import com.nexus.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/projects/{studentId}")
    public List<RecommendationResponse> recommendProjects(
            @PathVariable Long studentId) {

        return recommendationService.recommendProjects(studentId);
    }

}