package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddProjectRequest;
import com.nexus.backend.dto.request.UpdateProjectRequest;
import com.nexus.backend.dto.response.ProjectResponse;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final StudentRepository studentRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));
    }

    // =========================================
    // Mapper
    // =========================================

    private ProjectResponse mapToResponse(Project project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .projectTitle(project.getProjectTitle())
                .description(project.getDescription())
                .technologiesUsed(project.getTechnologiesUsed())
                .githubUrl(project.getGithubUrl())
                .liveDemoUrl(project.getLiveDemoUrl())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .build();

    }

    // =========================================
    // Add Project
    // =========================================

    @Override
    public ProjectResponse addProject(AddProjectRequest request) {

        Student student = getCurrentStudent();

        Project project = Project.builder()
                .projectTitle(request.getProjectTitle())
                .description(request.getDescription())
                .technologiesUsed(request.getTechnologiesUsed())
                .githubUrl(request.getGithubUrl())
                .liveDemoUrl(request.getLiveDemoUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .student(student)
                .build();

        projectRepository.save(project);

        return mapToResponse(project);

    }

    // =========================================
    // Get My Projects
    // =========================================

    @Override
    public List<ProjectResponse> getMyProjects() {

        Student student = getCurrentStudent();

        return projectRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Update Project
    // =========================================

    @Override
    public ProjectResponse updateProject(Long id,
                                         UpdateProjectRequest request) {

        Student student = getCurrentStudent();

        Project project = projectRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found."));

        project.setProjectTitle(request.getProjectTitle());
        project.setDescription(request.getDescription());
        project.setTechnologiesUsed(request.getTechnologiesUsed());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveDemoUrl(request.getLiveDemoUrl());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());

        projectRepository.save(project);

        return mapToResponse(project);

    }

    // =========================================
    // Delete Project
    // =========================================

    @Override
    public void deleteProject(Long id) {

        Student student = getCurrentStudent();

        Project project = projectRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found."));

        projectRepository.delete(project);

    }

}