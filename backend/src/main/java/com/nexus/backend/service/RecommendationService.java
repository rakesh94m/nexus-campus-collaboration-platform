package com.nexus.backend.service;

import com.nexus.backend.dto.response.RecommendationResponse;

import java.util.List;

public interface RecommendationService {

    List<RecommendationResponse> recommendProjects(Long studentId);

}