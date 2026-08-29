package com.nexus.backend.repository;

import com.nexus.backend.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository
        extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );
}