package com.nexus.backend.repository;

import com.nexus.backend.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRoadmapRepository
        extends JpaRepository<CareerRoadmap, Long> {

    // =========================================
    // Get all roadmaps of a student
    // Newest roadmap first
    // =========================================

    List<CareerRoadmap> findByStudentIdOrderByGeneratedAtDesc(
            Long studentId
    );

    // =========================================
    // Get latest roadmap of a student
    // =========================================

    Optional<CareerRoadmap> findFirstByStudentIdOrderByGeneratedAtDesc(
            Long studentId
    );
}