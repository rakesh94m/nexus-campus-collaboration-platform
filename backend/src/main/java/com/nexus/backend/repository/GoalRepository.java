package com.nexus.backend.repository;

import com.nexus.backend.entity.Goal;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByStudent(Student student);

    Optional<Goal> findByIdAndStudent(Long id, Student student);

}