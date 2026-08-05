package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddCertificationRequest;
import com.nexus.backend.dto.request.UpdateCertificationRequest;
import com.nexus.backend.dto.response.CertificationResponse;

import java.util.List;

public interface CertificationService {

    CertificationResponse addCertification(AddCertificationRequest request);

    List<CertificationResponse> getMyCertifications();

    CertificationResponse getCertificationById(Long id);

    CertificationResponse updateCertification(Long id,
                                              UpdateCertificationRequest request);

    void deleteCertification(Long id);

}