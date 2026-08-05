package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.CareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;
import com.nexus.backend.repository.CareerRoadmapRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CareerRoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CareerRoadmapServiceImpl implements CareerRoadmapService {

    private final CareerRoadmapRepository careerRoadmapRepository;
    private final StudentRepository studentRepository;

    @Override
    public CareerRoadmapResponse generateRoadmap(Long studentId,
                                                 CareerRoadmapRequest request) {

        throw new UnsupportedOperationException("Career roadmap generation will be implemented later.");

    }

    @Override
    public CareerRoadmapResponse getRoadmap(Long studentId) {

        throw new UnsupportedOperationException("Career roadmap retrieval will be implemented later.");

    }

}