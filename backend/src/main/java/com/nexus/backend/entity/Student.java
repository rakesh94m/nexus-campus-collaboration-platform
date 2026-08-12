package com.nexus.backend.entity;

import com.nexus.backend.entity.enums.AccountStatus;
import com.nexus.backend.entity.enums.AvailabilityStatus;
import com.nexus.backend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String rollNumber;

    private String phone;

    private String department;

    private String specialization;

    private Integer year;

    private String section;

    private Double cgpa;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String profilePhoto;

    private String resumeUrl;

    private String githubUrl;

    private String linkedinUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availabilityStatus;

    @Column(nullable = false)
    private Boolean emailVerified;

    private LocalDateTime lastLogin;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // =========================
    // Relationships
    // =========================

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<StudentSkill> studentSkills;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<StudentInterest> studentInterests;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Goal> goals;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Project> createdProjects;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<ProjectMember> projectMemberships;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Achievement> achievements;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Certification> certifications;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Notification> notifications;

    @OneToMany(
            mappedBy = "sender",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<CollaborationRequest> sentRequests;

    @OneToMany(
            mappedBy = "receiver",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<CollaborationRequest> receivedRequests;

    // =========================================
    // CAREER ROADMAP HISTORY
    // =========================================
    //
    // One student can have multiple AI-generated
    // career roadmaps.
    //
    // CareerRoadmap owns the relationship using:
    // @ManyToOne
    //
    // =========================================

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<CareerRoadmap> careerRoadmaps;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<MatchHistory> matchHistory;

    // =========================
    // Entity Lifecycle
    // =========================

    @PrePersist
    public void prePersist() {

        if (emailVerified == null) {
            emailVerified = false;
        }

        if (role == null) {
            role = Role.STUDENT;
        }

        if (accountStatus == null) {
            accountStatus = AccountStatus.ACTIVE;
        }

        if (availabilityStatus == null) {
            availabilityStatus = AvailabilityStatus.AVAILABLE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        // UpdateTimestamp handles updatedAt automatically.
    }
}