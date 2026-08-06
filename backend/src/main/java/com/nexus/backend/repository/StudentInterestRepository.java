package com.nexus.backend.repository;

import com.nexus.backend.entity.Interest;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentInterestRepository extends JpaRepository<StudentInterest, Long> {

    List<StudentInterest> findByStudent(Student student);

    Optional<StudentInterest> findByIdAndStudent(Long id, Student student);

    boolean existsByStudentAndInterest(Student student, Interest interest);
    Long countByStudentId(Long studentId);

}