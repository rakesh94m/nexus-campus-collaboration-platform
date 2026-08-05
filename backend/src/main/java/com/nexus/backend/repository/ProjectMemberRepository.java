package com.nexus.backend.repository;

import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.ProjectMember;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByStudent(Student student);

    Optional<ProjectMember> findByIdAndStudent(Long id, Student student);

    boolean existsByProjectAndStudent(Project project, Student student);

}