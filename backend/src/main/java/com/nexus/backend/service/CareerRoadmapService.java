package com.nexus.backend.service;

import com.nexus.backend.dto.request.CareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;

public interface CareerRoadmapService {

    CareerRoadmapResponse generateRoadmap(Long studentId, CareerRoadmapRequest request);

    CareerRoadmapResponse getRoadmap(Long studentId);

}