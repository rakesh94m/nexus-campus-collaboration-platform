package com.nexus.backend.dto.request;

import lombok.Data;

@Data
public class UpdateSocialLinksRequest {

    private String githubUrl;

    private String linkedinUrl;

    private String resumeUrl;
}