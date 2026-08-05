package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddSkillRequest;
import com.nexus.backend.dto.request.UpdateSkillRequest;
import com.nexus.backend.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    SkillResponse addSkill(AddSkillRequest request);

    List<SkillResponse> getMySkills();

    SkillResponse updateSkill(Long id, UpdateSkillRequest request);

    void deleteSkill(Long id);

}