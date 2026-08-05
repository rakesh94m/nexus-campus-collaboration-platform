package com.nexus.backend.repository;

import com.nexus.backend.entity.Skill;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudent(Student student);

    Optional<StudentSkill> findByIdAndStudent(Long id, Student student);

    boolean existsByStudentAndSkill(Student student, Skill skill);

}