package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddNotificationRequest;
import com.nexus.backend.dto.request.UpdateNotificationRequest;
import com.nexus.backend.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(AddNotificationRequest request);

    List<NotificationResponse> getAllNotifications();

    NotificationResponse getNotificationById(Long id);

    NotificationResponse updateNotification(Long id, UpdateNotificationRequest request);

    void deleteNotification(Long id);

}