package com.nexus.backend.service;

import com.nexus.backend.dto.response.GeminiCareerRoadmapResponse;
import com.nexus.backend.entity.Student;

public interface CareerRoadmapAIService {

    GeminiCareerRoadmapResponse generateCareerRoadmap(
            Student student
    );
}