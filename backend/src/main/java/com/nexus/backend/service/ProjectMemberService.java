package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddProjectMemberRequest;
import com.nexus.backend.dto.request.UpdateProjectMemberRequest;
import com.nexus.backend.dto.response.ProjectMemberResponse;

import java.util.List;

public interface ProjectMemberService {

    // =========================================
    // Add Project Member
    // =========================================

    ProjectMemberResponse addProjectMember(
            AddProjectMemberRequest request
    );

    // =========================================
    // Get My Project Memberships
    // =========================================

    List<ProjectMemberResponse> getMyProjects();

    // =========================================
    // Get All Members Of A Project
    // =========================================

    List<ProjectMemberResponse> getProjectMembers(
            Long projectId
    );

    // =========================================
    // Update Project Member Role
    // =========================================

    ProjectMemberResponse updateProjectMember(
            Long id,
            UpdateProjectMemberRequest request
    );

    // =========================================
    // Leave Project
    // =========================================

    void deleteProjectMember(Long id);

    // =========================================
    // Remove Member By Project Owner
    // =========================================

    void removeProjectMember(
            Long projectId,
            Long memberId
    );
}