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
    // Get My Project Memberships
    // =========================================

    @GetMapping
    public List<ProjectMemberResponse> getMyProjects() {

        return projectMemberService.getMyProjects();
    }

    // =========================================
    // Get All Members Of A Project
    // =========================================

    @GetMapping("/project/{projectId}")
    public List<ProjectMemberResponse> getProjectMembers(
            @PathVariable Long projectId) {

        return projectMemberService.getProjectMembers(projectId);
    }

    // =========================================
    // Update Project Member Role
    // =========================================

    @PutMapping("/{id}")
    public ProjectMemberResponse updateProjectMember(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectMemberRequest request) {

        return projectMemberService.updateProjectMember(
                id,
                request
        );
    }

    // =========================================
    // Leave Project
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProjectMember(
            @PathVariable Long id) {

        projectMemberService.deleteProjectMember(id);
    }

    // =========================================
    // Remove Member By Project Owner
    // =========================================

    @DeleteMapping("/project/{projectId}/member/{memberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeProjectMember(
            @PathVariable Long projectId,
            @PathVariable Long memberId) {

        projectMemberService.removeProjectMember(
                projectId,
                memberId
        );
    }
}