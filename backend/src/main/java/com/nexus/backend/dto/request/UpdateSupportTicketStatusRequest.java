package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.SupportTicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSupportTicketStatusRequest {

    @NotNull(
            message = "Ticket status is required"
    )
    private SupportTicketStatus status;

}