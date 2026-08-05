package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddProjectRequest;
import com.nexus.backend.dto.request.UpdateProjectRequest;
import com.nexus.backend.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse addProject(AddProjectRequest request);

    List<ProjectResponse> getMyProjects();

    ProjectResponse updateProject(Long id,
                                  UpdateProjectRequest request);

    void deleteProject(Long id);

}