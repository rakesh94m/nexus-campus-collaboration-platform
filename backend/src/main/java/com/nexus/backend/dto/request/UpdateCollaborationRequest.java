package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.CollaborationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCollaborationRequest {

    @NotNull
    private CollaborationStatus status;

}