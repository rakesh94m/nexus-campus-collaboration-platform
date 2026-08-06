package com.nexus.backend.service;

import com.nexus.backend.dto.response.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(Long studentId);

}