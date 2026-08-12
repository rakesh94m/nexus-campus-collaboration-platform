package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddCareerRoadmapRequest;
import com.nexus.backend.dto.request.UpdateCareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;

import java.util.List;

public interface CareerRoadmapService {

    // =========================================
    // Create New Career Roadmap
    // Every generation creates a new record
    // =========================================

    CareerRoadmapResponse createCareerRoadmap(
            AddCareerRoadmapRequest request
    );

    // =========================================
    // Get All Roadmaps
    // =========================================

    List<CareerRoadmapResponse> getAllCareerRoadmaps();

    // =========================================
    // Get My Roadmap History
    // =========================================

    List<CareerRoadmapResponse> getMyCareerRoadmaps();

    // =========================================
    // Get Latest Roadmap
    // =========================================

    CareerRoadmapResponse getLatestCareerRoadmap();

    // =========================================
    // Get Roadmap By ID
    // =========================================

    CareerRoadmapResponse getCareerRoadmapById(
            Long id
    );

    // =========================================
    // Update Roadmap
    // =========================================

    CareerRoadmapResponse updateCareerRoadmap(
            Long id,
            UpdateCareerRoadmapRequest request
    );

    // =========================================
    // Delete Roadmap
    // =========================================

    void deleteCareerRoadmap(Long id);
}