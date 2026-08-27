package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.CollaborationStatus;
import com.nexus.backend.entity.enums.MemberRole;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationRequestResponse {

    private Long id;

    private Long projectId;

    private String senderName;

    private String receiverName;

    private String projectTitle;

    private String message;

    private CollaborationStatus status;

    private MemberRole requestedRole;

    private LocalDateTime createdAt;
}