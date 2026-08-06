package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddCareerRoadmapRequest;
import com.nexus.backend.dto.request.UpdateCareerRoadmapRequest;
import com.nexus.backend.dto.response.CareerRoadmapResponse;
import com.nexus.backend.service.CareerRoadmapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-roadmaps")
@RequiredArgsConstructor
public class CareerRoadmapController {

    private final CareerRoadmapService careerRoadmapService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareerRoadmapResponse createCareerRoadmap(
            @Valid @RequestBody AddCareerRoadmapRequest request) {

        return careerRoadmapService.createCareerRoadmap(request);
    }

    @GetMapping
    public List<CareerRoadmapResponse> getAllCareerRoadmaps() {

        return careerRoadmapService.getAllCareerRoadmaps();
    }

    @GetMapping("/{id}")
    public CareerRoadmapResponse getCareerRoadmapById(
            @PathVariable Long id) {

        return careerRoadmapService.getCareerRoadmapById(id);
    }

    @PutMapping("/{id}")
    public CareerRoadmapResponse updateCareerRoadmap(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCareerRoadmapRequest request) {

        return careerRoadmapService.updateCareerRoadmap(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCareerRoadmap(
            @PathVariable Long id) {

        careerRoadmapService.deleteCareerRoadmap(id);
    }

}