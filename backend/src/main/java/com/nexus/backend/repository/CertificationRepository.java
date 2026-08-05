package com.nexus.backend.repository;

import com.nexus.backend.entity.Certification;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByStudent(Student student);

    Optional<Certification> findByIdAndStudent(Long id, Student student);

}