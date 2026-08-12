package com.nexus.backend.util;

import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentInterest;
import com.nexus.backend.entity.StudentSkill;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class MatchScoreCalculator {

    // =========================================
    // Calculate Project Match Score
    // =========================================

    public double calculate(
            Student student,
            Project project) {

        double score = 0.0;

        // =========================================
        // 1. SKILL MATCHING - 60%
        // =========================================

        Set<String> studentSkills =
                new HashSet<>();

        if (student.getStudentSkills() != null) {

            for (StudentSkill studentSkill :
                    student.getStudentSkills()) {

                if (studentSkill.getSkill() != null &&
                        studentSkill.getSkill()
                                .getSkillName() != null) {

                    studentSkills.add(
                            studentSkill
                                    .getSkill()
                                    .getSkillName()
                                    .toLowerCase()
                                    .trim()
                    );
                }
            }
        }

        Set<String> projectTechnologies =
                new HashSet<>();

        if (project.getTechnologiesUsed() != null &&
                !project.getTechnologiesUsed()
                        .trim()
                        .isEmpty()) {

            Arrays.stream(
                            project.getTechnologiesUsed()
                                    .split(",")
                    )
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .filter(value -> !value.isEmpty())
                    .forEach(
                            projectTechnologies::add
                    );
        }

        int matchedSkills = 0;

        for (String technology :
                projectTechnologies) {

            if (studentSkills.contains(
                    technology)) {

                matchedSkills++;
            }
        }

        if (!projectTechnologies.isEmpty()) {

            score +=
                    ((double) matchedSkills /
                            projectTechnologies.size())
                            * 60;
        }

        // =========================================
        // 2. INTEREST MATCHING - 25%
        // =========================================

        Set<String> interests =
                new HashSet<>();

        if (student.getStudentInterests() != null) {

            for (StudentInterest studentInterest :
                    student.getStudentInterests()) {

                if (studentInterest.getInterest() != null &&
                        studentInterest
                                .getInterest()
                                .getInterestName() != null) {

                    interests.add(
                            studentInterest
                                    .getInterest()
                                    .getInterestName()
                                    .toLowerCase()
                                    .trim()
                    );
                }
            }
        }

        String projectDescription = "";

        if (project.getDescription() != null) {

            projectDescription =
                    project.getDescription()
                            .toLowerCase();
        }

        int matchedInterests = 0;

        for (String interest :
                interests) {

            if (projectDescription
                    .contains(interest)) {

                matchedInterests++;
            }
        }

        if (!interests.isEmpty()) {

            score +=
                    ((double) matchedInterests /
                            interests.size())
                            * 25;
        }

        // =========================================
        // 3. AVAILABILITY - 10%
        // =========================================

        if (student.getAvailabilityStatus() != null) {

            score += 10;
        }

        // =========================================
        // 4. CGPA - 5%
        // =========================================

        if (student.getCgpa() != null &&
                student.getCgpa() >= 8.0) {

            score += 5;
        }

        // =========================================
        // FINAL SCORE
        // =========================================

        return Math.min(score, 100.0);
    }
}