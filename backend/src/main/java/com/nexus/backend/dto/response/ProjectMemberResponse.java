package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.MemberRole;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMemberResponse {

    private Long id;

    private String projectTitle;

    private MemberRole role;

    private LocalDateTime joinedAt;

}