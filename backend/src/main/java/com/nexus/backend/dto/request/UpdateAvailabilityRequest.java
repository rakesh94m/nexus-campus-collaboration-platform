package com.nexus.backend.dto.request;

import com.nexus.backend.entity.enums.AvailabilityStatus;
import lombok.Data;

@Data
public class UpdateAvailabilityRequest {

    private AvailabilityStatus availabilityStatus;
}