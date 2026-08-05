package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddAchievementRequest;
import com.nexus.backend.dto.request.UpdateAchievementRequest;
import com.nexus.backend.dto.response.AchievementResponse;

import java.util.List;

public interface AchievementService {

    AchievementResponse addAchievement(AddAchievementRequest request);

    List<AchievementResponse> getMyAchievements();

    AchievementResponse getAchievementById(Long id);

    AchievementResponse updateAchievement(Long id,
                                          UpdateAchievementRequest request);

    void deleteAchievement(Long id);

}