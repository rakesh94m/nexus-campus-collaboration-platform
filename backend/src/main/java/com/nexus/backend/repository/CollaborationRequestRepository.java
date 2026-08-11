package com.nexus.backend.repository;

import com.nexus.backend.entity.CollaborationRequest;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.enums.CollaborationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaborationRequestRepository
        extends JpaRepository<CollaborationRequest, Long> {

    List<CollaborationRequest> findBySender(Student sender);

    List<CollaborationRequest> findByReceiver(Student receiver);

    Optional<CollaborationRequest> findByIdAndReceiver(
            Long id,
            Student receiver
    );

    Long countByReceiverIdAndStatus(
            Long receiverId,
            CollaborationStatus status
    );

    Long countBySenderId(Long senderId);

    // Get all collaboration requests belonging to a project
    List<CollaborationRequest> findByProject(Project project);

    Optional<CollaborationRequest> findBySenderAndReceiverAndProjectAndStatus(
        Student sender,
        Student receiver,
        Project project,
        CollaborationStatus status
);
}