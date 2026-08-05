package com.nexus.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long studentId;

    private String fullName;

    private String email;

    private String token;

    private String role;

    private String message;

}