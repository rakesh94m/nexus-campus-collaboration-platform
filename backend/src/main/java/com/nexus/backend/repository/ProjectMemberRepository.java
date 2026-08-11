package com.nexus.backend.repository;

import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, Long> {

    // =========================================
    // Get memberships of a student
    // =========================================

    List<ProjectMember> findByStudent(Student student);

    // =========================================
    // Get specific membership of a student
    // =========================================

    Optional<ProjectMember> findByIdAndStudent(
            Long id,
            Student student
    );

    // =========================================
    // Check membership
    // =========================================

    boolean existsByProjectAndStudent(
            Project project,
            Student student
    );

    // =========================================
    // Get all members of a project
    // =========================================

    List<ProjectMember> findByProject(Project project);

    // =========================================
    // Find specific member in project
    // =========================================

    Optional<ProjectMember> findByProjectAndStudent(
            Project project,
            Student student
    );
}