package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddProjectMemberRequest;
import com.nexus.backend.dto.request.UpdateProjectMemberRequest;
import com.nexus.backend.dto.response.ProjectMemberResponse;

import java.util.List;

public interface ProjectMemberService {

    ProjectMemberResponse addProjectMember(AddProjectMemberRequest request);

    List<ProjectMemberResponse> getMyProjects();

    ProjectMemberResponse updateProjectMember(Long id,
                                              UpdateProjectMemberRequest request);

    void deleteProjectMember(Long id);

}