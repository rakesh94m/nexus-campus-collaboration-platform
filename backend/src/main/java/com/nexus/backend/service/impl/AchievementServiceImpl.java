package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddAchievementRequest;
import com.nexus.backend.dto.request.UpdateAchievementRequest;
import com.nexus.backend.dto.response.AchievementResponse;
import com.nexus.backend.entity.Achievement;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.AchievementRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;
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

    private AchievementResponse mapToResponse(Achievement achievement) {

        return AchievementResponse.builder()
                .id(achievement.getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .issuer(achievement.getIssuer())
                .achievementDate(achievement.getAchievementDate())
                .certificateUrl(achievement.getCertificateUrl())
                .build();

    }

    // =========================================
    // Add Achievement
    // =========================================

    @Override
    public AchievementResponse addAchievement(AddAchievementRequest request) {

        Student student = getCurrentStudent();

        Achievement achievement = Achievement.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .issuer(request.getIssuer())
                .achievementDate(request.getAchievementDate())
                .certificateUrl(request.getCertificateUrl())
                .student(student)
                .build();

        achievementRepository.save(achievement);

        return mapToResponse(achievement);

    }

    // =========================================
    // Get My Achievements
    // =========================================

    @Override
    public List<AchievementResponse> getMyAchievements() {

        Student student = getCurrentStudent();

        return achievementRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Get Achievement By Id
    // =========================================

    @Override
    public AchievementResponse getAchievementById(Long id) {

        Student student = getCurrentStudent();

        Achievement achievement = achievementRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Achievement not found."));

        return mapToResponse(achievement);

    }

    // =========================================
    // Update Achievement
    // =========================================

    @Override
    public AchievementResponse updateAchievement(Long id,
                                                 UpdateAchievementRequest request) {

        Student student = getCurrentStudent();

        Achievement achievement = achievementRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Achievement not found."));

        achievement.setTitle(request.getTitle());
        achievement.setDescription(request.getDescription());
        achievement.setIssuer(request.getIssuer());
        achievement.setAchievementDate(request.getAchievementDate());
        achievement.setCertificateUrl(request.getCertificateUrl());

        achievementRepository.save(achievement);

        return mapToResponse(achievement);

    }

    // =========================================
    // Delete Achievement
    // =========================================

    @Override
    public void deleteAchievement(Long id) {

        Student student = getCurrentStudent();

        Achievement achievement = achievementRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Achievement not found."));

        achievementRepository.delete(achievement);

    }

}