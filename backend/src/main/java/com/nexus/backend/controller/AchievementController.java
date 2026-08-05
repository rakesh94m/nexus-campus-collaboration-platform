package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddAchievementRequest;
import com.nexus.backend.dto.request.UpdateAchievementRequest;
import com.nexus.backend.dto.response.AchievementResponse;
import com.nexus.backend.service.AchievementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    // =========================================
    // Add Achievement
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AchievementResponse addAchievement(
            @Valid @RequestBody AddAchievementRequest request) {

        return achievementService.addAchievement(request);
    }

    // =========================================
    // Get My Achievements
    // =========================================

    @GetMapping
    public List<AchievementResponse> getMyAchievements() {

        return achievementService.getMyAchievements();
    }

    // =========================================
    // Get Achievement By Id
    // =========================================

    @GetMapping("/{id}")
    public AchievementResponse getAchievementById(
            @PathVariable Long id) {

        return achievementService.getAchievementById(id);
    }

    // =========================================
    // Update Achievement
    // =========================================

    @PutMapping("/{id}")
    public AchievementResponse updateAchievement(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAchievementRequest request) {

        return achievementService.updateAchievement(id, request);
    }

    // =========================================
    // Delete Achievement
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAchievement(@PathVariable Long id) {

        achievementService.deleteAchievement(id);
    }

}