package com.nexus.backend.repository;

import com.nexus.backend.entity.Achievement;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findByStudentOrderByAchievementDateDesc(Student student);

    Optional<Achievement> findByIdAndStudent(Long id, Student student);
    Long countByStudentId(Long studentId);

}