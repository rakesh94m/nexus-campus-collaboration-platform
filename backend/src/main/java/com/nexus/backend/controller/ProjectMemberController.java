package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddProjectMemberRequest;
import com.nexus.backend.dto.request.UpdateProjectMemberRequest;
import com.nexus.backend.dto.response.ProjectMemberResponse;
import com.nexus.backend.service.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-members")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    // =========================================
    // Add Project Member
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectMemberResponse addProjectMember(
            @Valid @RequestBody AddProjectMemberRequest request) {

        return projectMemberService.addProjectMember(request);
    }

    // =========================================
    // Get My Projects
    // =========================================

    @GetMapping
    public List<ProjectMemberResponse> getMyProjects() {

        return projectMemberService.getMyProjects();
    }

    // =========================================
    // Update Project Member
    // =========================================

    @PutMapping("/{id}")
    public ProjectMemberResponse updateProjectMember(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectMemberRequest request) {

        return projectMemberService.updateProjectMember(id, request);
    }

    // =========================================
    // Delete Project Member
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProjectMember(@PathVariable Long id) {

        projectMemberService.deleteProjectMember(id);
    }

}