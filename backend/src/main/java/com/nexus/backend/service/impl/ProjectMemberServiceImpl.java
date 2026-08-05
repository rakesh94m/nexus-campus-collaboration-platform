package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddProjectMemberRequest;
import com.nexus.backend.dto.request.UpdateProjectMemberRequest;
import com.nexus.backend.dto.response.ProjectMemberResponse;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.ProjectMemberRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectRepository projectRepository;
    private final StudentRepository studentRepository;
    private final ProjectMemberRepository projectMemberRepository;

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

    private ProjectMemberResponse mapToResponse(ProjectMember member) {

        return ProjectMemberResponse.builder()
                .id(member.getId())
                .projectTitle(member.getProject().getProjectTitle())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();

    }

    // =========================================
    // Add Project Member
    // =========================================

    @Override
    public ProjectMemberResponse addProjectMember(AddProjectMemberRequest request) {

        Student student = getCurrentStudent();

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found."));

        if (projectMemberRepository.existsByProjectAndStudent(project, student)) {

            throw new DuplicateResourceException("Already joined this project.");

        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .student(student)
                .role(request.getRole())
                .build();

        projectMemberRepository.save(member);

        return mapToResponse(member);

    }

    // =========================================
    // Get My Projects
    // =========================================

    @Override
    public List<ProjectMemberResponse> getMyProjects() {

        Student student = getCurrentStudent();

        return projectMemberRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Update Project Member
    // =========================================

    @Override
    public ProjectMemberResponse updateProjectMember(
            Long id,
            UpdateProjectMemberRequest request) {

        Student student = getCurrentStudent();

        ProjectMember member =
                projectMemberRepository.findByIdAndStudent(id, student)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Project member not found."));

        member.setRole(request.getRole());

        projectMemberRepository.save(member);

        return mapToResponse(member);

    }

    // =========================================
    // Delete Project Member
    // =========================================

    @Override
    public void deleteProjectMember(Long id) {

        Student student = getCurrentStudent();

        ProjectMember member =
                projectMemberRepository.findByIdAndStudent(id, student)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Project member not found."));

        projectMemberRepository.delete(member);

    }

}