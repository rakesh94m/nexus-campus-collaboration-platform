package com.nexus.backend.service;

import com.nexus.backend.dto.response.ProjectSearchResponse;
import com.nexus.backend.dto.response.StudentSearchResponse;
import com.nexus.backend.entity.enums.AvailabilityStatus;

import java.util.List;

public interface SearchService {

    List<StudentSearchResponse> searchStudentsByName(String name);

    List<StudentSearchResponse> searchStudentsByDepartment(String department);

    List<StudentSearchResponse> searchStudentsByAvailability(
            AvailabilityStatus availabilityStatus);

    List<StudentSearchResponse> searchStudentsBySkill(String skill);

    List<ProjectSearchResponse> searchProjectsByTitle(String title);

    List<ProjectSearchResponse> searchProjectsByTechnology(String technology);

}