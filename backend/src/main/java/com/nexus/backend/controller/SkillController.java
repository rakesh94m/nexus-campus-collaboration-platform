package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddSkillRequest;
import com.nexus.backend.dto.request.UpdateSkillRequest;
import com.nexus.backend.dto.response.SkillResponse;
import com.nexus.backend.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    // =====================================
    // Add Skill
    // =====================================

    @PostMapping
    public SkillResponse addSkill(
            @Valid @RequestBody AddSkillRequest request
    ) {

        return skillService.addSkill(request);

    }

    // =====================================
    // Get My Skills
    // =====================================

    @GetMapping
    public List<SkillResponse> getMySkills() {

        return skillService.getMySkills();

    }

    // =====================================
    // Update Skill
    // =====================================

    @PutMapping("/{id}")
    public SkillResponse updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSkillRequest request
    ) {

        return skillService.updateSkill(id, request);

    }

    // =====================================
    // Delete Skill
    // =====================================

    @DeleteMapping("/{id}")
    public void deleteSkill(
            @PathVariable Long id
    ) {

        skillService.deleteSkill(id);

    }

}