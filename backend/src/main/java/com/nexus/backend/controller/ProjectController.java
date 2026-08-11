package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddProjectRequest;
import com.nexus.backend.dto.request.UpdateProjectRequest;
import com.nexus.backend.dto.response.ProjectResponse;
import com.nexus.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // =========================================
    // Add Project
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse addProject(
            @Valid @RequestBody AddProjectRequest request) {

        return projectService.addProject(request);

    }

    // =========================================
    // Get My Projects
    // =========================================

    @GetMapping
    public List<ProjectResponse> getMyProjects() {

        return projectService.getMyProjects();

    }

// =========================================
// Get Available Projects
// =========================================

    @GetMapping("/available")
    public List<ProjectResponse> getAvailableProjects() {

        return projectService.getAvailableProjects();
    }

    // =========================================
    // Update Project
    // =========================================

    @PutMapping("/{id}")
    public ProjectResponse updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {

        return projectService.updateProject(id, request);

    }

    // =========================================
    // Delete Project
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {

        projectService.deleteProject(id);

    }

}