package com.nexus.backend.repository;

import com.nexus.backend.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {

}