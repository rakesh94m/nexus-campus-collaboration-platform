package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "projects",
        indexes = {
                @Index(
                        name = "idx_project_title",
                        columnList = "projectTitle"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 150
    )
    private String projectTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 300)
    private String technologiesUsed;

    @Column(length = 300)
    private String githubUrl;

    @Column(length = 300)
    private String liveDemoUrl;

    private LocalDate startDate;

    private LocalDate endDate;

    // =========================================
    // Project Owner
    // =========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    // =========================================
    // Required Project Skills
    // =========================================

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ProjectSkill> projectSkills;

    // =========================================
    // Timestamps
    // =========================================

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}