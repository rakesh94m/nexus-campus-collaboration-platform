package com.nexus.backend.service;

import com.nexus.backend.dto.response.GeminiRecommendationResponse;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;

public interface GeminiService {

    GeminiRecommendationResponse generateRecommendation(
            Student student,
            Project project,
            Double matchScore
    );

}