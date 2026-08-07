package com.nexus.backend.dto.response;

import com.nexus.backend.entity.enums.AvailabilityStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSearchResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String department;

    private String specialization;

    private Integer year;

    private Double cgpa;

    private AvailabilityStatus availabilityStatus;

}