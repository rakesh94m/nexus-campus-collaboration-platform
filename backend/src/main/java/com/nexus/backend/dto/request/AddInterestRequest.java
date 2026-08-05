package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddInterestRequest {

    @NotBlank(message = "Interest name is required.")
    private String interestName;

}