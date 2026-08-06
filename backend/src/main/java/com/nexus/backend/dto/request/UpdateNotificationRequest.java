package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.NotificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateNotificationRequest {

    @NotNull(message = "Notification status is required.")
    private NotificationStatus status;

}