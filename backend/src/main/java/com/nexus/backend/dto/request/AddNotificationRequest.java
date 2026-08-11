package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddNotificationRequest {

    @NotNull(message = "Student ID is required.")
    private Long studentId;

    @NotNull(message = "Notification type is required.")
    private NotificationType type;

    @NotBlank(message = "Message is required.")
    private String message;

    /*
     * ID of the related entity.
     *
     * For collaboration notifications,
     * this is the CollaborationRequest ID.
     */
    private Long referenceId;
}