package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddCareerRoadmapRequest;
import com.nexus.backend.dto.request.UpdateCareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;
import com.nexus.backend.entity.CareerRoadmap;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.CareerRoadmapRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CareerRoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerRoadmapServiceImpl
        implements CareerRoadmapService {

    private final CareerRoadmapRepository careerRoadmapRepository;
    private final StudentRepository studentRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return studentRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found."
                        ));
    }

    // =========================================
    // Create Career Roadmap
    // =========================================
    //
    // IMPORTANT:
    // Every new AI generation creates a NEW
    // CareerRoadmap record.
    //
    // Old roadmaps are NOT overwritten.
    // =========================================

    @Override
    @Transactional
    public CareerRoadmapResponse createCareerRoadmap(
            AddCareerRoadmapRequest request) {

        Student student =
                studentRepository
                        .findById(request.getStudentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found."
                                ));

        CareerRoadmap careerRoadmap =
                CareerRoadmap.builder()
                        .student(student)
                        .careerGoal(
                                request.getCareerGoal()
                        )
                        .currentSkills(
                                request.getCurrentSkills()
                        )
                        .missingSkills(
                                request.getMissingSkills()
                        )
                        .roadmap(
                                request.getRoadmap()
                        )
                        .careerAdvice(
                                request.getCareerAdvice()
                        )
                        .recommendedCertifications(
                                request.getRecommendedCertifications()
                        )
                        .build();

        careerRoadmap =
                careerRoadmapRepository.save(
                        careerRoadmap
                );

        return mapToResponse(careerRoadmap);
    }

    // =========================================
    // Get All Career Roadmaps
    // =========================================

    @Override
    public List<CareerRoadmapResponse>
    getAllCareerRoadmaps() {

        return careerRoadmapRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Get My Career Roadmap History
    // =========================================

    @Override
    public List<CareerRoadmapResponse>
    getMyCareerRoadmaps() {

        Student student = getCurrentStudent();

        return careerRoadmapRepository
                .findByStudentIdOrderByGeneratedAtDesc(
                        student.getId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Get Latest Career Roadmap
    // =========================================

    @Override
    public CareerRoadmapResponse
    getLatestCareerRoadmap() {

        Student student = getCurrentStudent();

        CareerRoadmap careerRoadmap =
                careerRoadmapRepository
                        .findFirstByStudentIdOrderByGeneratedAtDesc(
                                student.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No career roadmap found."
                                ));

        return mapToResponse(careerRoadmap);
    }

    // =========================================
    // Get Career Roadmap By ID
    // =========================================

    @Override
    public CareerRoadmapResponse
    getCareerRoadmapById(Long id) {

        Student student = getCurrentStudent();

        CareerRoadmap careerRoadmap =
                careerRoadmapRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Career roadmap not found."
                                ));

        // -----------------------------------------
        // Student can only access own roadmap
        // -----------------------------------------

        if (!careerRoadmap
                .getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "Career roadmap not found."
            );
        }

        return mapToResponse(careerRoadmap);
    }

    // =========================================
    // Update Career Roadmap
    // =========================================

    @Override
    @Transactional
    public CareerRoadmapResponse updateCareerRoadmap(
            Long id,
            UpdateCareerRoadmapRequest request) {

        Student student = getCurrentStudent();

        CareerRoadmap careerRoadmap =
                careerRoadmapRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Career roadmap not found."
                                ));

        // -----------------------------------------
        // Student can only update own roadmap
        // -----------------------------------------

        if (!careerRoadmap
                .getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "Career roadmap not found."
            );
        }

        careerRoadmap.setCareerGoal(
                request.getCareerGoal()
        );

        careerRoadmap.setCurrentSkills(
                request.getCurrentSkills()
        );

        careerRoadmap.setMissingSkills(
                request.getMissingSkills()
        );

        careerRoadmap.setRoadmap(
                request.getRoadmap()
        );

        careerRoadmap.setCareerAdvice(
                request.getCareerAdvice()
        );

        careerRoadmap.setRecommendedCertifications(
                request.getRecommendedCertifications()
        );

        careerRoadmap =
                careerRoadmapRepository.save(
                        careerRoadmap
                );

        return mapToResponse(careerRoadmap);
    }

    // =========================================
    // Delete Career Roadmap
    // =========================================

    @Override
    @Transactional
    public void deleteCareerRoadmap(Long id) {

        Student student = getCurrentStudent();

        CareerRoadmap careerRoadmap =
                careerRoadmapRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Career roadmap not found."
                                ));

        // -----------------------------------------
        // Student can only delete own roadmap
        // -----------------------------------------

        if (!careerRoadmap
                .getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "Career roadmap not found."
            );
        }

        careerRoadmapRepository.delete(
                careerRoadmap
        );
    }

    // =========================================
    // Entity -> Response Mapper
    // =========================================

    private CareerRoadmapResponse mapToResponse(
            CareerRoadmap careerRoadmap) {

        return CareerRoadmapResponse.builder()
                .id(careerRoadmap.getId())
                .studentId(
                        careerRoadmap
                                .getStudent()
                                .getId()
                )
                .careerGoal(
                        careerRoadmap.getCareerGoal()
                )
                .currentSkills(
                        careerRoadmap.getCurrentSkills()
                )
                .missingSkills(
                        careerRoadmap.getMissingSkills()
                )
                .roadmap(
                        careerRoadmap.getRoadmap()
                )
                .careerAdvice(
                        careerRoadmap.getCareerAdvice()
                )
                .recommendedCertifications(
                        careerRoadmap
                                .getRecommendedCertifications()
                )
                .generatedAt(
                        careerRoadmap.getGeneratedAt()
                )
                .updatedAt(
                        careerRoadmap.getUpdatedAt()
                )
                .build();
    }
}