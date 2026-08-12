package com.nexus.backend.controller;

import com.nexus.backend.dto.response.MatchResponse;
import com.nexus.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    // =========================================
    // Get Recommended Projects
    // =========================================

    @GetMapping("/projects")
    public List<MatchResponse> getProjectMatches() {

        return matchingService.getProjectMatches();
    }
}