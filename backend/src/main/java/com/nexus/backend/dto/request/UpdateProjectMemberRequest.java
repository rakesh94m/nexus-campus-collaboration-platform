package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.MemberRole;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProjectMemberRequest {

    @NotNull
    private MemberRole role;

}