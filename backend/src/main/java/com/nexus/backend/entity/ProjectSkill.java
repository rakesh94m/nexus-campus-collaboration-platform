package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "project_skills",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"project_id", "skill_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
}