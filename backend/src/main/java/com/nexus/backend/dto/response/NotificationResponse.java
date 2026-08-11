package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.NotificationStatus;
import com.nexus.backend.entity.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private Long studentId;

    private NotificationType type;

    private String message;

    private NotificationStatus status;

    private Long referenceId;

    private LocalDateTime createdAt;
}