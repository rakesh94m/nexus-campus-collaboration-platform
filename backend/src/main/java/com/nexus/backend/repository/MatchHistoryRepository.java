package com.nexus.backend.repository;

import com.nexus.backend.entity.MatchHistory;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchHistoryRepository
        extends JpaRepository<MatchHistory, Long> {

    Optional<MatchHistory> findByStudentAndProject(
            Student student,
            Project project
    );

    List<MatchHistory> findByProject(
            Project project
    );


    List<MatchHistory> findByStudent(
            Student student
    );
}