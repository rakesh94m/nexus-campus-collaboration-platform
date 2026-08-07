package com.nexus.backend.repository;

import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRollNumber(String rollNumber);

    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName,String lastName);

    List<Student> findByDepartmentIgnoreCase(String department);

    List<Student> findByAvailabilityStatus(AvailabilityStatus availabilityStatus);

}