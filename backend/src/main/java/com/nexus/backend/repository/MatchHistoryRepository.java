package com.nexus.backend.repository;

import com.nexus.backend.entity.MatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchHistoryRepository extends JpaRepository<MatchHistory, Long> {

    List<MatchHistory> findByStudentId(Long studentId);

}