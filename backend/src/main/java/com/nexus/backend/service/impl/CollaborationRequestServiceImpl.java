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

        Student receiver =
                studentRepository
                        .findById(request.getReceiverId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Receiver student not found."
                                ));

        // Prevent sending to yourself
        if (receiver.getId().equals(sender.getId())) {

            throw new DuplicateResourceException(
                    "You cannot send a collaboration request to yourself."
            );
        }

        Project project =
                projectRepository
                        .findById(request.getProjectId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found."
                                ));

        // Project must belong to sender
        if (!project.getStudent()
                .getId()
                .equals(sender.getId())) {

            throw new DuplicateResourceException(
                    "You can only send collaboration requests using your own project."
            );
        }

        // Already a member
        if (projectMemberRepository
                .existsByProjectAndStudent(
                        project,
                        receiver
                )) {

            throw new DuplicateResourceException(
                    "This student is already a member of the project."
            );
        }

        // Duplicate pending request
        if (collaborationRequestRepository
                .findBySenderAndReceiverAndProjectAndStatus(
                        sender,
                        receiver,
                        project,
                        CollaborationStatus.PENDING
                )
                .isPresent()) {

            throw new DuplicateResourceException(
                    "A collaboration request is already pending for this student."
            );
        }

        // Create collaboration request
        CollaborationRequest collaborationRequest =
                CollaborationRequest.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .project(project)
                        .message(request.getMessage())
                        .status(CollaborationStatus.PENDING)
                        .build();

        collaborationRequestRepository.save(
                collaborationRequest
        );

        // =========================================
        // CREATE PROJECT INVITATION NOTIFICATION
        // =========================================

        Notification notification =
                Notification.builder()
                        .student(receiver)
                        .type(NotificationType.PROJECT_INVITE)
                        .message(
                                sender.getFirstName()
                                        + " "
                                        + sender.getLastName()
                                        + " invited you to collaborate on project \""
                                        + project.getProjectTitle()
                                        + "\"."
                        )
                        .status(NotificationStatus.UNREAD)

                        // IMPORTANT:
                        // Store CollaborationRequest ID
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

        Student receiver = getCurrentStudent();

        CollaborationRequest collaborationRequest =
                collaborationRequestRepository
                        .findByIdAndReceiver(
                                id,
                                receiver
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Request not found."
                                ));

        // Request already processed
        if (collaborationRequest.getStatus()
                != CollaborationStatus.PENDING) {

            throw new DuplicateResourceException(
                    "This collaboration request has already been processed."
            );
        }

        Project project =
                collaborationRequest.getProject();

        Student sender =
                collaborationRequest.getSender();

        // =========================================
        // REJECT REQUEST
        // =========================================

        if (request.getStatus()
                == CollaborationStatus.REJECTED) {

            collaborationRequest.setStatus(
                    CollaborationStatus.REJECTED
            );

            collaborationRequestRepository.save(
                    collaborationRequest
            );

            Notification notification =
                    Notification.builder()
                            .student(sender)
                            .type(
                                    NotificationType.REQUEST_REJECTED
                            )
                            .message(
                                    receiver.getFirstName()
                                            + " "
                                            + receiver.getLastName()
                                            + " rejected your collaboration request for project \""
                                            + project.getProjectTitle()
                                            + "\"."
                            )
                            .status(
                                    NotificationStatus.UNREAD
                            )
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
        // ACCEPT REQUEST
        // =========================================

        if (request.getStatus()
                == CollaborationStatus.ACCEPTED) {

            // Add receiver as project member
            if (!projectMemberRepository
                    .existsByProjectAndStudent(
                            project,
                            receiver
                    )) {

                ProjectMember member =
                        ProjectMember.builder()
                                .project(project)
                                .student(receiver)
                                .role(MemberRole.MEMBER)
                                .build();

                projectMemberRepository.save(member);
            }

            // Update collaboration request
            collaborationRequest.setStatus(
                    CollaborationStatus.ACCEPTED
            );

            collaborationRequestRepository.save(
                    collaborationRequest
            );

            // Notify sender
            Notification notification =
                    Notification.builder()
                            .student(sender)
                            .type(
                                    NotificationType.REQUEST_ACCEPTED
                            )
                            .message(
                                    receiver.getFirstName()
                                            + " "
                                            + receiver.getLastName()
                                            + " accepted your collaboration request for project \""
                                            + project.getProjectTitle()
                                            + "\"."
                            )
                            .status(
                                    NotificationStatus.UNREAD
                            )
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
        // INVALID STATUS
        // =========================================

        throw new DuplicateResourceException(
                "Invalid collaboration request status."
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
}