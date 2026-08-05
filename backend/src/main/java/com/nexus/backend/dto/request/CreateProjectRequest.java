package com.nexus.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProjectRequest {

    @NotBlank(message = "Project title is required")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Project description is required")
    @Size(max = 5000)
    private String description;

    @NotBlank(message = "Project domain is required")
    @Size(max = 50)
    private String domain;

    @Min(value = 1)
    @Max(value = 20)
    private Integer maxMembers;

}