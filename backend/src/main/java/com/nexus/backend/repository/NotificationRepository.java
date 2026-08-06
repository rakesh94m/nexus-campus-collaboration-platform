package com.nexus.backend.repository;

import com.nexus.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentId(Long studentId);

}