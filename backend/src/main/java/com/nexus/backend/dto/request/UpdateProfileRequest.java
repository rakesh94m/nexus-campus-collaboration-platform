package com.nexus.backend.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String bio;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double cgpa;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 digits.")
    private String phone;

    private String section;

    private String specialization;
}