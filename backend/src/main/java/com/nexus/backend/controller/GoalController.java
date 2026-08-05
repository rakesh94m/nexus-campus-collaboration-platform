package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddGoalRequest;
import com.nexus.backend.dto.request.UpdateGoalRequest;
import com.nexus.backend.dto.response.GoalResponse;
import com.nexus.backend.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    // =========================================
    // Add Goal
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalResponse addGoal(
            @Valid @RequestBody AddGoalRequest request) {

        return goalService.addGoal(request);
    }

    // =========================================
    // Get My Goals
    // =========================================

    @GetMapping
    public List<GoalResponse> getMyGoals() {

        return goalService.getMyGoals();
    }

    // =========================================
    // Update Goal
    // =========================================

    @PutMapping("/{id}")
    public GoalResponse updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGoalRequest request) {

        return goalService.updateGoal(id, request);
    }

    // =========================================
    // Delete Goal
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGoal(@PathVariable Long id) {

        goalService.deleteGoal(id);
    }

}