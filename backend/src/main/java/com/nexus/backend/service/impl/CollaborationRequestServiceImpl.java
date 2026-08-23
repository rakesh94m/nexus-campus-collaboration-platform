package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddCollaborationRequest;
import com.nexus.backend.dto.request.UpdateCollaborationRequest;
import com.nexus.backend.dto.response.CollaborationRequestResponse;
import com.nexus.backend.entity.CollaborationRequest;
import com.nexus.backend.entity.Notification;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.CollaborationStatus;
import com.nexus.backend.entity.enums.MemberRole;
import com.nexus.backend.entity.enums.NotificationStatus;
import com.nexus.backend.entity.enums.NotificationType;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.CollaborationRequestRepository;
import com.nexus.backend.repository.NotificationRepository;
import com.nexus.backend.repository.ProjectMemberRepository;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CollaborationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollaborationRequestServiceImpl
        implements CollaborationRequestService {

    private final CollaborationRequestRepository collaborationRequestRepository;
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
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
    // Mapper
    // =========================================

    private CollaborationRequestResponse mapToResponse(
            CollaborationRequest request) {

        return CollaborationRequestResponse.builder()
                .id(request.getId())

                .senderName(
                        request.getSender().getFirstName()
                                + " "
                                + request.getSender().getLastName()
                )

                .receiverName(
                        request.getReceiver().getFirstName()
                                + " "
                                + request.getReceiver().getLastName()
                )

                .projectTitle(
                        request.getProject().getProjectTitle()
                )

                .message(request.getMessage())

                .status(request.getStatus())

                .requestedRole(
                        request.getRequestedRole()
                )

                .createdAt(request.getCreatedAt())

                .build();
    }

    // =========================================
    // Send Collaboration Request
    // =========================================

    @Override
    @Transactional
    public CollaborationRequestResponse sendRequest(
            AddCollaborationRequest request) {

        Student sender = getCurrentStudent();

        Project project =
                projectRepository
                        .findById(request.getProjectId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found."
                                ));

        Student receiver = project.getStudent();

        // -----------------------------------------
        // Cannot join own project
        // -----------------------------------------

        if (receiver.getId().equals(sender.getId())) {

            throw new DuplicateResourceException(
                    "You are the owner of this project."
            );
        }

        // -----------------------------------------
        // Already a member
        // -----------------------------------------

        if (projectMemberRepository
                .existsByProjectAndStudent(
                        project,
                        sender
                )) {

            throw new DuplicateResourceException(
                    "You are already a member of this project."
            );
        }

        // -----------------------------------------
        // Validate requested role
        // -----------------------------------------

        MemberRole requestedRole =
                request.getRequestedRole();

        if (requestedRole == null) {

            throw new IllegalArgumentException(
                    "Requested role is required."
            );
        }

        // Student cannot request owner-level role
        if (requestedRole == MemberRole.LEADER) {

            throw new IllegalArgumentException(
                    "Leader role cannot be requested."
            );
        }

        // -----------------------------------------
        // Duplicate pending request
        // -----------------------------------------

        if (collaborationRequestRepository
                .findBySenderAndReceiverAndProjectAndStatus(
                        sender,
                        receiver,
                        project,
                        CollaborationStatus.PENDING
                )
                .isPresent()) {

            throw new DuplicateResourceException(
                    "You already have a pending request for this project."
            );
        }

        // -----------------------------------------
        // Create collaboration request
        // -----------------------------------------

        CollaborationRequest collaborationRequest =
                CollaborationRequest.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .project(project)
                        .requestedRole(requestedRole)
                        .message(request.getMessage())
                        .status(CollaborationStatus.PENDING)
                        .build();

        collaborationRequestRepository.save(
                collaborationRequest
        );

        // -----------------------------------------
        // Notify project owner
        // -----------------------------------------

        Notification notification =
                Notification.builder()
                        .student(receiver)
                        .type(NotificationType.PROJECT_INVITE)
                        .message(
                                sender.getFirstName()
                                        + " "
                                        + sender.getLastName()
                                        + " requested to join your project \""
                                        + project.getProjectTitle()
                                        + "\" as "
                                        + formatRole(requestedRole)
                                        + "."
                        )
                        .status(NotificationStatus.UNREAD)
                        .referenceId(
                                collaborationRequest.getId()
                        )
                        .build();

        notificationRepository.save(notification);

        return mapToResponse(
                collaborationRequest
        );
    }

    // =========================================
    // Received Requests
    // =========================================

    @Override
    public List<CollaborationRequestResponse>
    getReceivedRequests() {

        Student receiver = getCurrentStudent();

        return collaborationRequestRepository
                .findByReceiver(receiver)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Sent Requests
    // =========================================

    @Override
    public List<CollaborationRequestResponse>
    getSentRequests() {

        Student sender = getCurrentStudent();

        return collaborationRequestRepository
                .findBySender(sender)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Accept / Reject Request
    // =========================================

    @Override
    @Transactional
    public CollaborationRequestResponse updateRequest(
            Long id,
            UpdateCollaborationRequest request) {

        Student owner = getCurrentStudent();

        CollaborationRequest collaborationRequest =
                collaborationRequestRepository
                        .findByIdAndReceiver(
                                id,
                                owner
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Request not found."
                                ));

        if (collaborationRequest.getStatus()
                != CollaborationStatus.PENDING) {

            throw new DuplicateResourceException(
                    "This request has already been processed."
            );
        }

        Project project =
                collaborationRequest.getProject();

        Student applicant =
                collaborationRequest.getSender();

        // =========================================
        // REJECT
        // =========================================

        if (request.getStatus()
                == CollaborationStatus.REJECTED) {

            collaborationRequest.setStatus(
                    CollaborationStatus.REJECTED
            );

            collaborationRequestRepository.save(
                    collaborationRequest
            );

            notificationRepository.save(
                    Notification.builder()
                            .student(applicant)
                            .type(
                                    NotificationType.REQUEST_REJECTED
                            )
                            .message(
                                    "Your request to join \""
                                            + project.getProjectTitle()
                                            + "\" was rejected."
                            )
                            .status(
                                    NotificationStatus.UNREAD
                            )
                            .referenceId(
                                    collaborationRequest.getId()
                            )
                            .build()
            );

            return mapToResponse(
                    collaborationRequest
            );
        }

        // =========================================
        // ACCEPT
        // =========================================

        if (request.getStatus()
                == CollaborationStatus.ACCEPTED) {

            if (!projectMemberRepository
                    .existsByProjectAndStudent(
                            project,
                            applicant
                    )) {

                MemberRole requestedRole =
                        collaborationRequest
                                .getRequestedRole();

                // Safety fallback for old requests
                if (requestedRole == null) {
                    requestedRole = MemberRole.MEMBER;
                }

                projectMemberRepository.save(
                        ProjectMember.builder()
                                .project(project)
                                .student(applicant)
                                .role(requestedRole)
                                .build()
                );
            }

            collaborationRequest.setStatus(
                    CollaborationStatus.ACCEPTED
            );

            collaborationRequestRepository.save(
                    collaborationRequest
            );

            notificationRepository.save(
                    Notification.builder()
                            .student(applicant)
                            .type(
                                    NotificationType.REQUEST_ACCEPTED
                            )
                            .message(
                                    "Your request to join \""
                                            + project.getProjectTitle()
                                            + "\" as "
                                            + formatRole(
                                            collaborationRequest
                                                    .getRequestedRole()
                                    )
                                            + " has been accepted."
                            )
                            .status(
                                    NotificationStatus.UNREAD
                            )
                            .referenceId(
                                    collaborationRequest.getId()
                            )
                            .build()
            );

            return mapToResponse(
                    collaborationRequest
            );
        }

        throw new DuplicateResourceException(
                "Invalid request status."
        );
    }

    // =========================================
    // Delete Request
    // =========================================

    @Override
    @Transactional
    public void deleteRequest(Long id) {

        Student sender = getCurrentStudent();

        CollaborationRequest collaborationRequest =
                collaborationRequestRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Request not found."
                                ));

        if (!collaborationRequest
                .getSender()
                .getId()
                .equals(sender.getId())) {

            throw new ResourceNotFoundException(
                    "Request not found."
            );
        }

        collaborationRequestRepository.delete(
                collaborationRequest
        );
    }

    // =========================================
    // Format Role For Notification
    // =========================================

    private String formatRole(MemberRole role) {

        if (role == null) {
            return "Member";
        }

        return switch (role) {

            case LEADER ->
                    "Leader";

            case BACKEND_DEVELOPER ->
                    "Backend Developer";

            case FRONTEND_DEVELOPER ->
                    "Frontend Developer";

            case AI_ENGINEER ->
                    "AI Engineer";

            case DATABASE_ENGINEER ->
                    "Database Engineer";

            case TESTER ->
                    "Tester";

            case MEMBER ->
                    "Member";
        };
    }
}