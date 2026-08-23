package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddProjectMemberRequest;
import com.nexus.backend.dto.request.UpdateProjectMemberRequest;
import com.nexus.backend.dto.response.ProjectMemberResponse;
import com.nexus.backend.entity.Notification;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.MemberRole;
import com.nexus.backend.entity.enums.NotificationStatus;
import com.nexus.backend.entity.enums.NotificationType;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.NotificationRepository;
import com.nexus.backend.repository.ProjectMemberRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl
        implements ProjectMemberService {

    private final ProjectRepository projectRepository;
    private final StudentRepository studentRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final NotificationRepository notificationRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return studentRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found."
                        ));
    }

    // =========================================
    // Check Project Owner
    // =========================================

    private void verifyProjectOwner(
            Project project,
            Student student) {

        if (!project.getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "You are not the owner of this project."
            );
        }
    }

    // =========================================
    // Mapper
    // =========================================

    private ProjectMemberResponse mapToResponse(
            ProjectMember member) {

        return ProjectMemberResponse.builder()
                .id(member.getId())
                .projectId(member.getProject().getId())
                .projectTitle(
                        member.getProject()
                                .getProjectTitle()
                )
                .studentId(member.getStudent().getId())
                .studentName(
                        member.getStudent().getFirstName()
                                + " "
                                + member.getStudent().getLastName()
                )
                .studentEmail(
                        member.getStudent().getEmail()
                )
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }

    // =========================================
    // Add Project Member
    // =========================================

    @Override
    @Transactional
    public ProjectMemberResponse addProjectMember(
            AddProjectMemberRequest request) {

        Student student = getCurrentStudent();

        Project project =
                projectRepository
                        .findById(request.getProjectId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found."
                                ));

        // -----------------------------------------
        // Project owner cannot join own project
        // -----------------------------------------

        if (project.getStudent()
                .getId()
                .equals(student.getId())) {

            throw new DuplicateResourceException(
                    "You are already the owner of this project."
            );
        }

        // -----------------------------------------
        // Check duplicate membership
        // -----------------------------------------

        if (projectMemberRepository
                .existsByProjectAndStudent(
                        project,
                        student)) {

            throw new DuplicateResourceException(
                    "Already joined this project."
            );
        }

        // -----------------------------------------
        // Prevent joining as LEADER
        // -----------------------------------------

        if (request.getRole() == MemberRole.LEADER) {

            throw new DuplicateResourceException(
                    "Only the project owner can be the leader."
            );
        }

        ProjectMember member =
                ProjectMember.builder()
                        .project(project)
                        .student(student)
                        .role(request.getRole())
                        .build();

        projectMemberRepository.save(member);

        return mapToResponse(member);
    }

    // =========================================
    // Get My Project Memberships
    // =========================================

    @Override
    public List<ProjectMemberResponse> getMyProjects() {

        Student student = getCurrentStudent();

        return projectMemberRepository
                .findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Get All Members Of A Project
    // =========================================

    @Override
    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found."
                        ));

        return projectMemberRepository
                .findByProject(project)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Update Project Member Role
    // =========================================

    @Override
    @Transactional
    public ProjectMemberResponse updateProjectMember(
            Long id,
            UpdateProjectMemberRequest request) {

        Student currentStudent = getCurrentStudent();

        ProjectMember member =
                projectMemberRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project member not found."
                                ));

        Project project = member.getProject();

        // -----------------------------------------
        // Only project owner can change roles
        // -----------------------------------------

        verifyProjectOwner(
                project,
                currentStudent
        );

        // -----------------------------------------
        // Cannot make another member LEADER
        // -----------------------------------------

        if (request.getRole() == MemberRole.LEADER) {

            throw new DuplicateResourceException(
                    "The project owner is the only leader."
            );
        }

        member.setRole(request.getRole());

        projectMemberRepository.save(member);

        return mapToResponse(member);
    }

    // =========================================
    // Leave Project
    // =========================================

    @Override
    @Transactional
    public void deleteProjectMember(Long id) {

        Student currentStudent = getCurrentStudent();

        ProjectMember member =
                projectMemberRepository
                        .findByIdAndStudent(
                                id,
                                currentStudent
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project member not found."
                                ));

        // -----------------------------------------
        // Only normal members can leave
        // -----------------------------------------

        if (member.getRole() == MemberRole.LEADER) {

            throw new DuplicateResourceException(
                    "The project owner cannot leave the project."
            );
        }

        projectMemberRepository.delete(member);
    }

    // =========================================
    // Remove Member By Project Owner
    // =========================================

    @Override
    @Transactional
    public void removeProjectMember(
            Long projectId,
            Long memberId) {

        Student currentStudent = getCurrentStudent();

        // -----------------------------------------
        // Find project
        // -----------------------------------------

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found."
                                ));

        // -----------------------------------------
        // Only project owner can remove members
        // -----------------------------------------

        verifyProjectOwner(
                project,
                currentStudent
        );

        // -----------------------------------------
        // Find member
        // -----------------------------------------

        ProjectMember member =
                projectMemberRepository
                        .findById(memberId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project member not found."
                                ));

        // -----------------------------------------
        // Make sure member belongs to this project
        // -----------------------------------------

        if (!member.getProject()
                .getId()
                .equals(projectId)) {

            throw new ResourceNotFoundException(
                    "Project member not found."
            );
        }

        // -----------------------------------------
        // Owner cannot remove the leader
        // -----------------------------------------

        if (member.getRole() == MemberRole.LEADER) {

            throw new DuplicateResourceException(
                    "The project owner cannot be removed."
            );
        }

        // -----------------------------------------
        // Store removed student's information
        // before deleting membership
        // -----------------------------------------

        Student removedStudent = member.getStudent();

        // -----------------------------------------
        // Remove member
        // -----------------------------------------

        projectMemberRepository.delete(member);

        // -----------------------------------------
        // Create notification
        // -----------------------------------------

        Notification notification =
                Notification.builder()
                        .student(removedStudent)
                        .type(NotificationType.SYSTEM)
                        .message(
                                "You have been removed from the project \""
                                        + project.getProjectTitle()
                                        + "\"."
                        )
                        .status(NotificationStatus.UNREAD)
                        .build();

        notificationRepository.save(notification);
    }
}