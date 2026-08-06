package com.nexus.backend.controller;

import com.nexus.backend.dto.response.DashboardResponse;
import com.nexus.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/{studentId}")
    public DashboardResponse getDashboard(
            @PathVariable Long studentId) {

        return dashboardService.getDashboard(studentId);
    }

}