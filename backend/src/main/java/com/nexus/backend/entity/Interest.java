package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(
        name = "interests",
        indexes = {
                @Index(name = "idx_interest_name", columnList = "interestName")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String interestName;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "interest", cascade = CascadeType.ALL)
    private List<StudentInterest> studentInterests;
}