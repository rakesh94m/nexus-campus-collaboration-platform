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

    // Student skills
    @PostMapping
    public SkillResponse addSkill(@Valid @RequestBody AddSkillRequest request) {
        return skillService.addSkill(request);
    }

    @GetMapping
    public List<SkillResponse> getMySkills() {
        return skillService.getMySkills();
    }

    @PutMapping("/{id}")
    public SkillResponse updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSkillRequest request) {
        return skillService.updateSkill(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
    }

    // Master skill catalog
    @GetMapping("/catalog")
    public List<SkillResponse> getAllSkills() {
        return skillService.getAllSkills();
    }

    @PostMapping("/catalog")
    public SkillResponse createSkill(@Valid @RequestBody AddSkillRequest request) {
        return skillService.createSkill(request);
    }

    @GetMapping("/catalog/search")
    public List<SkillResponse> searchSkills(
            @RequestParam String keyword) {
        return skillService.searchSkills(keyword);
    }
}