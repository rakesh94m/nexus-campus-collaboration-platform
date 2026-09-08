package com.nexus.backend.repository;

import com.nexus.backend.entity.Notification;
import com.nexus.backend.entity.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentId(Long studentId);
    Long countByStudentId(Long studentId);

    // Bug #9: count only notifications with a specific status (e.g. UNREAD)
    Long countByStudentIdAndStatus(Long studentId, NotificationStatus status);

}