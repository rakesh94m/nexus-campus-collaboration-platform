package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "career_roadmaps",
        indexes = {
                @Index(
                        name = "idx_career_roadmap_student",
                        columnList = "student_id"
                ),
                @Index(
                        name = "idx_career_roadmap_generated",
                        columnList = "generatedAt"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================
    // Student
    // =========================================

    /*
     * One student can have multiple generated
     * career roadmaps.
     *
     * This allows roadmap history.
     */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    // =========================================
    // Career Goal
    // =========================================

    @Column(nullable = false, length = 150)
    private String careerGoal;

    // =========================================
    // Current Skills
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String currentSkills;

    // =========================================
    // Missing Skills
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    // =========================================
    // Learning Roadmap
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String roadmap;

    // =========================================
    // Career Advice
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String careerAdvice;

    // =========================================
    // Recommended Certifications
    // =========================================

    @Column(columnDefinition = "TEXT")
    private String recommendedCertifications;

    // =========================================
    // AI Generation Timestamp
    // =========================================

    @CreationTimestamp
    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime generatedAt;

    // =========================================
    // Last Updated
    // =========================================

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}