package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(
        name = "skills",
        indexes = {
                @Index(name = "idx_skill_name", columnList = "skillName")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String skillName;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL)
    private List<StudentSkill> studentSkills;

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL)
    private List<ProjectSkill> projectSkills;

}