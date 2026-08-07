package com.nexus.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSearchResponse {

    private Long id;

    private String projectTitle;

    private String description;

    private String technologiesUsed;

    private String githubUrl;

    private String liveDemoUrl;

}