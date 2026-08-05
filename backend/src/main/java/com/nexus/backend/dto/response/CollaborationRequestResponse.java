package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.CollaborationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationRequestResponse {

    private Long id;

    private String senderName;

    private String receiverName;

    private String projectTitle;

    private String message;

    private CollaborationStatus status;

    private LocalDateTime createdAt;

}