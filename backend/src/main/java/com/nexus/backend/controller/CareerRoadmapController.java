package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddCareerRoadmapRequest;
import com.nexus.backend.dto.request.UpdateCareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;
import com.nexus.backend.dto.response.GeminiCareerRoadmapResponse;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CareerRoadmapAIService;
import com.nexus.backend.service.CareerRoadmapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-roadmaps")
@RequiredArgsConstructor
public class CareerRoadmapController {

    private final CareerRoadmapService careerRoadmapService;

    private final CareerRoadmapAIService careerRoadmapAIService;

    private final StudentRepository studentRepository;

    // =========================================
    // Generate AI Career Roadmap
    // =========================================
    //
    // Every generation is automatically saved
    // as a new roadmap history record.
    //
    // =========================================

    @PostMapping("/generate")
    public CareerRoadmapResponse generateCareerRoadmap() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found."
                                ));

        GeminiCareerRoadmapResponse aiResponse =
                careerRoadmapAIService
                        .generateCareerRoadmap(student);

        // -----------------------------------------
        // Save every AI generation
        // -----------------------------------------

        AddCareerRoadmapRequest request =
                AddCareerRoadmapRequest.builder()
                        .studentId(student.getId())
                        .careerGoal(
                                aiResponse.getCareerGoal()
                        )
                        .currentSkills(
                                aiResponse.getCurrentSkills()
                        )
                        .missingSkills(
                                aiResponse.getMissingSkills()
                        )
                        .roadmap(
                                aiResponse.getRoadmap()
                        )
                        .careerAdvice(
                                aiResponse.getCareerAdvice()
                        )
                        .recommendedCertifications(
                                aiResponse
                                        .getRecommendedCertifications()
                        )
                        .build();

        return careerRoadmapService
                .createCareerRoadmap(request);
    }

    // =========================================
    // Create Career Roadmap Manually
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareerRoadmapResponse createCareerRoadmap(
            @Valid
            @RequestBody
            AddCareerRoadmapRequest request) {

        return careerRoadmapService
                .createCareerRoadmap(request);
    }

    // =========================================
    // Get All Career Roadmaps
    // =========================================
    //
    // Mainly useful for administration/testing.
    //
    // =========================================

    @GetMapping
    public List<CareerRoadmapResponse>
    getAllCareerRoadmaps() {

        return careerRoadmapService
                .getAllCareerRoadmaps();
    }

    // =========================================
    // Get My Career Roadmap History
    // =========================================

    @GetMapping("/my")
    public List<CareerRoadmapResponse>
    getMyCareerRoadmaps() {

        return careerRoadmapService
                .getMyCareerRoadmaps();
    }

    // =========================================
    // Get Latest Career Roadmap
    // =========================================

    @GetMapping("/latest")
    public CareerRoadmapResponse
    getLatestCareerRoadmap() {

        return careerRoadmapService
                .getLatestCareerRoadmap();
    }

    // =========================================
    // Get Career Roadmap By ID
    // =========================================

    @GetMapping("/{id}")
    public CareerRoadmapResponse
    getCareerRoadmapById(
            @PathVariable Long id) {

        return careerRoadmapService
                .getCareerRoadmapById(id);
    }

    // =========================================
    // Update Career Roadmap
    // =========================================

    @PutMapping("/{id}")
    public CareerRoadmapResponse
    updateCareerRoadmap(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateCareerRoadmapRequest request) {

        return careerRoadmapService
                .updateCareerRoadmap(
                        id,
                        request
                );
    }

    // =========================================
    // Delete Career Roadmap
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCareerRoadmap(
            @PathVariable Long id) {

        careerRoadmapService
                .deleteCareerRoadmap(id);
    }
}