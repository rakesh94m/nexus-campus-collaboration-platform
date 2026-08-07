package com.nexus.backend.controller;

import com.nexus.backend.dto.response.ProjectSearchResponse;
import com.nexus.backend.dto.response.StudentSearchResponse;
import com.nexus.backend.entity.enums.AvailabilityStatus;
import com.nexus.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/students/name")
    public List<StudentSearchResponse> searchStudentsByName(
            @RequestParam String name) {

        return searchService.searchStudentsByName(name);
    }

    @GetMapping("/students/department")
    public List<StudentSearchResponse> searchStudentsByDepartment(
            @RequestParam String department) {

        return searchService.searchStudentsByDepartment(department);
    }

    @GetMapping("/students/availability")
    public List<StudentSearchResponse> searchStudentsByAvailability(
            @RequestParam AvailabilityStatus availabilityStatus) {

        return searchService.searchStudentsByAvailability(availabilityStatus);
    }

    @GetMapping("/students/skill")
    public List<StudentSearchResponse> searchStudentsBySkill(
            @RequestParam String skill) {

        return searchService.searchStudentsBySkill(skill);
    }

    @GetMapping("/projects/title")
    public List<ProjectSearchResponse> searchProjectsByTitle(
            @RequestParam String title) {

        return searchService.searchProjectsByTitle(title);
    }

    @GetMapping("/projects/technology")
    public List<ProjectSearchResponse> searchProjectsByTechnology(
            @RequestParam String technology) {

        return searchService.searchProjectsByTechnology(technology);
    }

}