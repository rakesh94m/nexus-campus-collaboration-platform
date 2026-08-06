package com.nexus.backend.repository;

import com.nexus.backend.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {

    Optional<CareerRoadmap> findByStudentId(Long studentId);

}