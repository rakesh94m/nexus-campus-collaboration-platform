package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateCertificationRequest {

    @NotBlank(message = "Certificate name is required.")
    private String certificateName;

    @NotBlank(message = "Issuing organization is required.")
    private String issuingOrganization;

    @NotNull(message = "Issue date is required.")
    private LocalDate issueDate;

    private LocalDate expiryDate;

    private String credentialUrl;

}