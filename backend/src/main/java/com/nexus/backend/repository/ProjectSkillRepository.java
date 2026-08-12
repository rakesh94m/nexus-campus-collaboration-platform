package com.nexus.backend.repository;

import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectSkillRepository
        extends JpaRepository<ProjectSkill, Long> {

    // =========================================
    // Get all required skills of a project
    // =========================================

    List<ProjectSkill> findByProject(Project project);

    // =========================================
    // Delete all required skills of a project
    // =========================================

    void deleteByProject(Project project);
}