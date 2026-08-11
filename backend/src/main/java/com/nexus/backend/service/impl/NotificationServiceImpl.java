package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddNotificationRequest;
import com.nexus.backend.dto.request.UpdateNotificationRequest;
import com.nexus.backend.dto.response.NotificationResponse;
import com.nexus.backend.entity.Notification;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.NotificationStatus;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.NotificationRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

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

    private NotificationResponse mapToResponse(
            Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .studentId(
                        notification.getStudent().getId()
                )
                .type(notification.getType())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .referenceId(notification.getReferenceId())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    // =========================================
    // Create Notification
    // =========================================

    @Override
    @Transactional
    public NotificationResponse createNotification(
            AddNotificationRequest request) {

        Student student =
                studentRepository
                        .findById(request.getStudentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found."
                                ));

        Notification notification =
                Notification.builder()
                        .student(student)
                        .type(request.getType())
                        .message(request.getMessage())
                        .status(NotificationStatus.UNREAD)
                        .referenceId(request.getReferenceId())
                        .build();

        notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    // =========================================
    // Get My Notifications
    // =========================================

    @Override
    public List<NotificationResponse>
    getAllNotifications() {

        Student student = getCurrentStudent();

        return notificationRepository
                .findByStudentId(student.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Get Notification By ID
    // =========================================

    @Override
    public NotificationResponse getNotificationById(
            Long id) {

        Student student = getCurrentStudent();

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found."
                                ));

        if (!notification
                .getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "Notification not found."
            );
        }

        return mapToResponse(notification);
    }

    // =========================================
    // Update Notification
    // =========================================

    @Override
    @Transactional
    public NotificationResponse updateNotification(
            Long id,
            UpdateNotificationRequest request) {

        Student student = getCurrentStudent();

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found."
                                ));

        if (!notification
                .getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "Notification not found."
            );
        }

        notification.setStatus(
                request.getStatus()
        );

        notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    // =========================================
    // Delete Notification
    // =========================================

    @Override
    @Transactional
    public void deleteNotification(Long id) {

        Student student = getCurrentStudent();

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found."
                                ));

        if (!notification
                .getStudent()
                .getId()
                .equals(student.getId())) {

            throw new ResourceNotFoundException(
                    "Notification not found."
            );
        }

        notificationRepository.delete(notification);
    }
}