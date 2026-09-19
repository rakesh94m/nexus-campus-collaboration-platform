package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.SupportCategory;
import com.nexus.backend.entity.enums.SupportTicketStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSupportTicketResponse {

    private Long id;

    private Long studentId;

    private String studentFullName;

    private String studentEmail;

    private SupportCategory category;

    private String subject;

    private String message;

    private SupportTicketStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
