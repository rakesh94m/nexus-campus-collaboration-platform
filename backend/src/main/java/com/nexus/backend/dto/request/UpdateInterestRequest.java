package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateInterestRequest {

    @NotBlank(message = "Interest name is required")
    @Size(max = 100, message = "Interest name cannot exceed 100 characters")
    private String interestName;
}