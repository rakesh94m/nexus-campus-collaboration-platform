package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddGoalRequest;
import com.nexus.backend.dto.request.UpdateGoalRequest;
import com.nexus.backend.dto.response.GoalResponse;
import com.nexus.backend.entity.Goal;
import com.nexus.backend.entity.Student;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.GoalRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
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

    private GoalResponse mapToResponse(Goal goal) {

        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .status(goal.getStatus())
                .build();

    }

    // =========================================
    // Add Goal
    // =========================================

    @Override
    public GoalResponse addGoal(AddGoalRequest request) {

        Student student = getCurrentStudent();

        Goal goal = Goal.builder()
                .student(student)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .build();

        goalRepository.save(goal);

        return mapToResponse(goal);

    }

    // =========================================
    // Get My Goals
    // =========================================

    @Override
    public List<GoalResponse> getMyGoals() {

        Student student = getCurrentStudent();

        return goalRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    // =========================================
    // Update Goal
    // =========================================

    @Override
    public GoalResponse updateGoal(Long id,
                                   UpdateGoalRequest request) {

        Student student = getCurrentStudent();

        Goal goal = goalRepository.findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Goal not found."));

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setStatus(request.getStatus());

        goalRepository.save(goal);

        return mapToResponse(goal);

    }

    // =========================================
    // Delete Goal
    // =========================================

    @Override
    public void deleteGoal(Long id) {

        Student student = getCurrentStudent();

        Goal goal = goalRepository.findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Goal not found."));

        goalRepository.delete(goal);

    }

}