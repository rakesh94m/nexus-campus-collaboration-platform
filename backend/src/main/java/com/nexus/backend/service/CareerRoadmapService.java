package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddCareerRoadmapRequest;
import com.nexus.backend.dto.request.UpdateCareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;

import java.util.List;

public interface CareerRoadmapService {

    CareerRoadmapResponse createCareerRoadmap(AddCareerRoadmapRequest request);

    List<CareerRoadmapResponse> getAllCareerRoadmaps();

    CareerRoadmapResponse getCareerRoadmapById(Long id);

    CareerRoadmapResponse updateCareerRoadmap(Long id,
                                              UpdateCareerRoadmapRequest request);

    void deleteCareerRoadmap(Long id);

}