package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddCertificationRequest;
import com.nexus.backend.dto.request.UpdateCertificationRequest;
import com.nexus.backend.dto.response.CertificationResponse;
import com.nexus.backend.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    // =========================================
    // Add Certification
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CertificationResponse addCertification(
            @Valid @RequestBody AddCertificationRequest request) {

        return certificationService.addCertification(request);
    }

    // =========================================
    // Get My Certifications
    // =========================================

    @GetMapping
    public List<CertificationResponse> getMyCertifications() {

        return certificationService.getMyCertifications();
    }

    // =========================================
    // Update Certification
    // =========================================

    @PutMapping("/{id}")
    public CertificationResponse updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCertificationRequest request) {

        return certificationService.updateCertification(id, request);
    }

    // =========================================
    // Delete Certification
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCertification(@PathVariable Long id) {

        certificationService.deleteCertification(id);
    }
}