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

    public double calculate(Student student, Project project) {

        double score = 0.0;

        Set<String> studentSkills = new HashSet<>();

        if (student.getStudentSkills() != null) {
            for (StudentSkill studentSkill : student.getStudentSkills()) {
                studentSkills.add(
                        studentSkill.getSkill()
                                .getSkillName()
                                .toLowerCase()
                                .trim()
                );
            }
        }

        Set<String> projectTechnologies = new HashSet<>();

        if (project.getTechnologiesUsed() != null) {

            Arrays.stream(project.getTechnologiesUsed().split(","))
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .forEach(projectTechnologies::add);
        }

        int matchedSkills = 0;

        for (String technology : projectTechnologies) {

            if (studentSkills.contains(technology)) {
                matchedSkills++;
            }
        }

        if (!projectTechnologies.isEmpty()) {

            score += ((double) matchedSkills /
                    projectTechnologies.size()) * 60;
        }

        Set<String> interests = new HashSet<>();

        if (student.getStudentInterests() != null) {

            for (StudentInterest interest : student.getStudentInterests()) {

                interests.add(
                        interest.getInterest()
                                .getInterestName()
                                .toLowerCase()
                                .trim()
                );
            }
        }

        String projectDescription = "";

        if (project.getDescription() != null) {
            projectDescription = project.getDescription().toLowerCase();
        }

        int matchedInterests = 0;

        for (String interest : interests) {

            if (projectDescription.contains(interest)) {
                matchedInterests++;
            }
        }

        if (!interests.isEmpty()) {

            score += ((double) matchedInterests /
                    interests.size()) * 25;
        }

        if (student.getAvailabilityStatus() != null) {
            score += 10;
        }

        if (student.getCgpa() != null && student.getCgpa() >= 8.0) {
            score += 5;
        }

        return Math.min(score, 100);
    }

}