package com.nexus.backend.repository;

import com.nexus.backend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findBySkillName(String skillName);

    Optional<Skill> findBySkillNameIgnoreCase(String skillName);

    @Query("""
        SELECT s.skillName
        FROM Skill s
        WHERE LOWER(s.skillName)
        LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY s.skillName
    """)
    List<String> searchSkills(@Param("query") String query);


}