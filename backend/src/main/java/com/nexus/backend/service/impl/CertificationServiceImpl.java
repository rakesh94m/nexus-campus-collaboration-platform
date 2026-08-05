package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddCertificationRequest;
import com.nexus.backend.dto.request.UpdateCertificationRequest;
import com.nexus.backend.dto.response.CertificationResponse;
import com.nexus.backend.entity.Certification;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.CertificationRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final StudentRepository studentRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));
    }

    // =========================================
    // Mapper
    // =========================================

    private CertificationResponse mapToResponse(Certification certification) {

        return CertificationResponse.builder()
                .id(certification.getId())
                .certificateName(certification.getCertificateName())
                .issuingOrganization(certification.getIssuingOrganization())
                .issueDate(certification.getIssueDate())
                .expiryDate(certification.getExpiryDate())
                .credentialUrl(certification.getCredentialUrl())
                .build();

    }

    // =========================================
    // Add Certification
    // =========================================

    @Override
    public CertificationResponse addCertification(AddCertificationRequest request) {

        Student student = getCurrentStudent();

        Certification certification = Certification.builder()
                .certificateName(request.getCertificateName())
                .issuingOrganization(request.getIssuingOrganization())
                .issueDate(request.getIssueDate())
                .expiryDate(request.getExpiryDate())
                .credentialUrl(request.getCredentialUrl())
                .student(student)
                .build();

        certificationRepository.save(certification);

        return mapToResponse(certification);

    }

    // =========================================
    // Get My Certifications
    // =========================================

    @Override
    public List<CertificationResponse> getMyCertifications() {

        Student student = getCurrentStudent();

        return certificationRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Get Certification By Id
    // =========================================

    @Override
    public CertificationResponse getCertificationById(Long id) {

        Student student = getCurrentStudent();

        Certification certification = certificationRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certification not found."));

        return mapToResponse(certification);

    }

    // =========================================
    // Update Certification
    // =========================================

    @Override
    public CertificationResponse updateCertification(Long id,
                                                     UpdateCertificationRequest request) {

        Student student = getCurrentStudent();

        Certification certification = certificationRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certification not found."));

        certification.setCertificateName(request.getCertificateName());
        certification.setIssuingOrganization(request.getIssuingOrganization());
        certification.setIssueDate(request.getIssueDate());
        certification.setExpiryDate(request.getExpiryDate());
        certification.setCredentialUrl(request.getCredentialUrl());

        certificationRepository.save(certification);

        return mapToResponse(certification);

    }

    // =========================================
    // Delete Certification
    // =========================================

    @Override
    public void deleteCertification(Long id) {

        Student student = getCurrentStudent();

        Certification certification = certificationRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certification not found."));

        certificationRepository.delete(certification);

    }

}