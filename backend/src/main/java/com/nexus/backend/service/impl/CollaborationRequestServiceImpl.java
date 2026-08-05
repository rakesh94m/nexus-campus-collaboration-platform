package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddCollaborationRequest;
import com.nexus.backend.dto.request.UpdateCollaborationRequest;
import com.nexus.backend.dto.response.CollaborationRequestResponse;
import com.nexus.backend.entity.CollaborationRequest;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.CollaborationStatus;
import com.nexus.backend.entity.enums.MemberRole;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.CollaborationRequestRepository;
import com.nexus.backend.repository.ProjectMemberRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CollaborationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollaborationRequestServiceImpl
        implements CollaborationRequestService {

    private final CollaborationRequestRepository collaborationRequestRepository;
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
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

    private CollaborationRequestResponse mapToResponse(
            CollaborationRequest request) {

        return CollaborationRequestResponse.builder()
                .id(request.getId())
                .senderName(request.getSender().getFirstName() + " " +
                        request.getSender().getLastName())
                .receiverName(request.getReceiver().getFirstName() + " " +
                        request.getReceiver().getLastName())
                .projectTitle(request.getProject().getProjectTitle())
                .message(request.getMessage())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();

    }

    // =========================================
    // Send Request
    // =========================================

    @Override
    public CollaborationRequestResponse sendRequest(
            AddCollaborationRequest request) {

        Student sender = getCurrentStudent();

        Project project = projectRepository.findById(request.getProjectId())
        .orElseThrow(() ->
                new ResourceNotFoundException("Project not found."));

        Student receiver = project.getStudent();

        if (project.getStudent().getId().equals(sender.getId())) {
        throw new DuplicateResourceException(
                "You cannot send a collaboration request to your own project.");
}

        CollaborationRequest collaborationRequest =
                CollaborationRequest.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .project(project)
                        .message(request.getMessage())
                        .status(CollaborationStatus.PENDING)
                        .build();

        collaborationRequestRepository.save(collaborationRequest);

        return mapToResponse(collaborationRequest);

    }

    // =========================================
    // Received Requests
    // =========================================

    @Override
    public List<CollaborationRequestResponse> getReceivedRequests() {

        Student receiver = getCurrentStudent();

        return collaborationRequestRepository.findByReceiver(receiver)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Sent Requests
    // =========================================

    @Override
    public List<CollaborationRequestResponse> getSentRequests() {

        Student sender = getCurrentStudent();

        return collaborationRequestRepository.findBySender(sender)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Update Request
    // =========================================

    @Override
    public CollaborationRequestResponse updateRequest(
            Long id,
            UpdateCollaborationRequest request) {

        Student receiver = getCurrentStudent();

        CollaborationRequest collaborationRequest =
                collaborationRequestRepository
                        .findByIdAndReceiver(id, receiver)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Request not found."));

        collaborationRequest.setStatus(request.getStatus());

        // Automatically add accepted student as project member

        if (request.getStatus() == CollaborationStatus.ACCEPTED) {

            if (!projectMemberRepository.existsByProjectAndStudent(
                    collaborationRequest.getProject(),
                    collaborationRequest.getSender())) {

                ProjectMember member = ProjectMember.builder()
                        .project(collaborationRequest.getProject())
                        .student(collaborationRequest.getSender())
                        .role(MemberRole.MEMBER)
                        .build();

                projectMemberRepository.save(member);
            }

        }

        collaborationRequestRepository.save(collaborationRequest);

        return mapToResponse(collaborationRequest);

    }

    // =========================================
    // Delete Request
    // =========================================

    @Override
    public void deleteRequest(Long id) {

        Student receiver = getCurrentStudent();

        CollaborationRequest collaborationRequest =
                collaborationRequestRepository
                        .findByIdAndReceiver(id, receiver)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Request not found."));

        collaborationRequestRepository.delete(collaborationRequest);

    }

}