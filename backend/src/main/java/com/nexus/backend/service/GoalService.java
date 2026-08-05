package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddGoalRequest;
import com.nexus.backend.dto.request.UpdateGoalRequest;
import com.nexus.backend.dto.response.GoalResponse;

import java.util.List;

public interface GoalService {

    GoalResponse addGoal(AddGoalRequest request);

    List<GoalResponse> getMyGoals();

    GoalResponse updateGoal(Long id,
                            UpdateGoalRequest request);

    void deleteGoal(Long id);

}