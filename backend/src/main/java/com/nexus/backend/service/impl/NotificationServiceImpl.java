package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.NotificationResponse;
import com.nexus.backend.repository.NotificationRepository;
import com.nexus.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getStudentNotifications(Long studentId) {

        throw new UnsupportedOperationException("Notification retrieval will be implemented later.");

    }

}