package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "student_interests",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "interest_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interest_id", nullable = false)
    private Interest interest;

}