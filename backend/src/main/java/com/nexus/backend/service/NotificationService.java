package com.nexus.backend.service;

import com.nexus.backend.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getStudentNotifications(Long studentId);

}