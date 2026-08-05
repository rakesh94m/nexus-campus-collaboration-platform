package com.nexus.backend.repository;

import com.nexus.backend.entity.CollaborationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, Long> {

}