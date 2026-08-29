package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.SupportCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSupportTicketRequest {

    @NotNull(
            message = "Support category is required"
    )
    private SupportCategory category;

    @NotBlank(
            message = "Subject is required"
    )
    @Size(
            max = 150,
            message = "Subject cannot exceed 150 characters"
    )
    private String subject;

    @NotBlank(
            message = "Message is required"
    )
    @Size(
            max = 5000,
            message = "Message cannot exceed 5000 characters"
    )
    private String message;
}