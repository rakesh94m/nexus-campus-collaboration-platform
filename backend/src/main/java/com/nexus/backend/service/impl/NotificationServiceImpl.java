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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    @Override
    public NotificationResponse createNotification(AddNotificationRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));

        Notification notification = Notification.builder()
                .student(student)
                .type(request.getType())
                .message(request.getMessage())
                .status(NotificationStatus.UNREAD)
                .build();

        notification = notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    @Override
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponse getNotificationById(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found."));

        return mapToResponse(notification);
    }

    @Override
    public NotificationResponse updateNotification(Long id,
                                                   UpdateNotificationRequest request) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found."));

        notification.setStatus(request.getStatus());

        notification = notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    @Override
    public void deleteNotification(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found."));

        notificationRepository.delete(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .studentId(notification.getStudent().getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }

}