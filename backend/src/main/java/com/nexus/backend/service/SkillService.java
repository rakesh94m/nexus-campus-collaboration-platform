package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddSkillRequest;
import com.nexus.backend.dto.request.UpdateSkillRequest;
import com.nexus.backend.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    // Student Skills
    SkillResponse addSkill(AddSkillRequest request);

    List<SkillResponse> getMySkills();

    SkillResponse updateSkill(Long id, UpdateSkillRequest request);

    void deleteSkill(Long id);

    // Global Skill Catalog
    List<SkillResponse> getAllSkills();

    SkillResponse createSkill(AddSkillRequest request);

    List<SkillResponse> searchSkills(String keyword);
}