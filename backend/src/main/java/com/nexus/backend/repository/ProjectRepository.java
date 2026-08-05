package com.nexus.backend.repository;

import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStudent(Student student);

    Optional<Project> findByIdAndStudent(Long id, Student student);
}