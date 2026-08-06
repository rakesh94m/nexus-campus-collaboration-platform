package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddCareerRoadmapRequest;
import com.nexus.backend.dto.request.UpdateCareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;
import com.nexus.backend.entity.CareerRoadmap;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.CareerRoadmapRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CareerRoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerRoadmapServiceImpl implements CareerRoadmapService {

    private final CareerRoadmapRepository careerRoadmapRepository;
    private final StudentRepository studentRepository;

    @Override
    public CareerRoadmapResponse createCareerRoadmap(AddCareerRoadmapRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));

        if (careerRoadmapRepository.findByStudentId(request.getStudentId()).isPresent()) {
            throw new DuplicateResourceException(
                    "Career roadmap already exists for this student.");
        }

        CareerRoadmap careerRoadmap = CareerRoadmap.builder()
                .student(student)
                .careerGoal(request.getCareerGoal())
                .roadmap(request.getRoadmap())
                .build();

        careerRoadmap = careerRoadmapRepository.save(careerRoadmap);

        return mapToResponse(careerRoadmap);
    }

    @Override
    public List<CareerRoadmapResponse> getAllCareerRoadmaps() {

        return careerRoadmapRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CareerRoadmapResponse getCareerRoadmapById(Long id) {

        CareerRoadmap careerRoadmap = careerRoadmapRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Career roadmap not found."));

        return mapToResponse(careerRoadmap);
    }

    @Override
    public CareerRoadmapResponse updateCareerRoadmap(Long id,
                                                     UpdateCareerRoadmapRequest request) {

        CareerRoadmap careerRoadmap = careerRoadmapRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Career roadmap not found."));

        careerRoadmap.setCareerGoal(request.getCareerGoal());
        careerRoadmap.setRoadmap(request.getRoadmap());

        careerRoadmap = careerRoadmapRepository.save(careerRoadmap);

        return mapToResponse(careerRoadmap);
    }

    @Override
    public void deleteCareerRoadmap(Long id) {

        CareerRoadmap careerRoadmap = careerRoadmapRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Career roadmap not found."));

        careerRoadmapRepository.delete(careerRoadmap);
    }

    private CareerRoadmapResponse mapToResponse(CareerRoadmap careerRoadmap) {

        return CareerRoadmapResponse.builder()
                .id(careerRoadmap.getId())
                .studentId(careerRoadmap.getStudent().getId())
                .careerGoal(careerRoadmap.getCareerGoal())
                .roadmap(careerRoadmap.getRoadmap())
                .generatedAt(careerRoadmap.getGeneratedAt())
                .build();
    }

}