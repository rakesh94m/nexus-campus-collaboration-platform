package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddNotificationRequest;
import com.nexus.backend.dto.request.UpdateNotificationRequest;
import com.nexus.backend.dto.response.NotificationResponse;
import com.nexus.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NotificationResponse createNotification(
            @Valid @RequestBody AddNotificationRequest request) {

        return notificationService.createNotification(request);
    }

    @GetMapping
    public List<NotificationResponse> getAllNotifications() {

        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public NotificationResponse getNotificationById(
            @PathVariable Long id) {

        return notificationService.getNotificationById(id);
    }

    @PutMapping("/{id}")
    public NotificationResponse updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNotificationRequest request) {

        return notificationService.updateNotification(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotification(
            @PathVariable Long id) {

        notificationService.deleteNotification(id);
    }

}