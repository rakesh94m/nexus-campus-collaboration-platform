package com.nexus.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.nexus.backend.dto.response.GeminiCareerRoadmapResponse;
import com.nexus.backend.entity.Goal;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentInterest;
import com.nexus.backend.entity.StudentSkill;
import com.nexus.backend.service.CareerRoadmapAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerRoadmapAIServiceImpl
        implements CareerRoadmapAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    // =========================================
    // Generate Career Roadmap
    // =========================================

    @Override
    public GeminiCareerRoadmapResponse generateCareerRoadmap(
            Student student) {

        Client client =
                Client.builder()
                        .apiKey(apiKey)
                        .build();

        String prompt =
                buildPrompt(student);

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );

        try {

            JsonNode json =
                    objectMapper.readTree(
                            response.text()
                    );

            return GeminiCareerRoadmapResponse
                    .builder()
                    .careerGoal(
                            getText(
                                    json,
                                    "careerGoal"
                            )
                    )
                    .currentSkills(
                            getText(
                                    json,
                                    "currentSkills"
                            )
                    )
                    .missingSkills(
                            getText(
                                    json,
                                    "missingSkills"
                            )
                    )
                    .roadmap(
                            getText(
                                    json,
                                    "roadmap"
                            )
                    )
                    .careerAdvice(
                            getText(
                                    json,
                                    "careerAdvice"
                            )
                    )
                    .recommendedCertifications(
                            getText(
                                    json,
                                    "recommendedCertifications"
                            )
                    )
                    .build();

        } catch (Exception e) {

            return GeminiCareerRoadmapResponse
                    .builder()
                    .careerGoal(
                            "Unable to generate career goal."
                    )
                    .currentSkills("")
                    .missingSkills("")
                    .roadmap("")
                    .careerAdvice(
                            "Unable to generate AI career advice."
                    )
                    .recommendedCertifications("")
                    .build();
        }
    }

    // =========================================
    // Build Gemini Prompt
    // =========================================

    private String buildPrompt(
            Student student) {

        return """
                You are an expert AI Career Mentor.

                Analyze the student's academic profile,
                skills, interests, goals, and availability.

                Your task is to create a realistic and
                personalized career roadmap.

                ## STUDENT PROFILE

                Name:
                %s %s

                Department:
                %s

                Specialization:
                %s

                Year:
                %s

                CGPA:
                %s

                Availability:
                %s

                ## CURRENT SKILLS

                %s

                ## INTERESTS

                %s

                ## STUDENT GOALS

                %s

                ## INSTRUCTIONS

                1. Identify ONE realistic target career role.

                2. Summarize the student's current relevant skills.

                3. Identify the most important missing skills
                   required for the target role.

                4. Create a practical learning roadmap with
                   4 to 6 ordered steps.

                5. Give concise career advice based on the
                   student's current profile.

                6. Recommend 1 to 3 relevant certifications.

                7. Do not recommend unrealistic career paths.

                8. Keep the response concise and practical.

                9. Do not repeat the entire student profile.

                10. Return ONLY valid JSON.

                Use this exact structure:

                {
                  "careerGoal": "",
                  "currentSkills": "",
                  "missingSkills": "",
                  "roadmap": "",
                  "careerAdvice": "",
                  "recommendedCertifications": ""
                }

                Do not return markdown.
                Do not use ```json.
                Do not add explanations outside the JSON.
                """.formatted(
                student.getFirstName(),
                student.getLastName(),
                safe(student.getDepartment()),
                safe(student.getSpecialization()),
                safe(student.getYear()),
                safe(student.getCgpa()),
                safe(student.getAvailabilityStatus()),
                getStudentSkills(student),
                getStudentInterests(student),
                getStudentGoals(student)
        );
    }

    // =========================================
    // Student Skills
    // =========================================

    private String getStudentSkills(
            Student student) {

        if (student.getStudentSkills() == null ||
                student.getStudentSkills().isEmpty()) {

            return "No skills available";
        }

        return student.getStudentSkills()
                .stream()
                .map(StudentSkill::getSkill)
                .filter(skill -> skill != null)
                .map(skill -> skill.getSkillName())
                .collect(Collectors.joining(", "));
    }

    // =========================================
    // Student Interests
    // =========================================

    private String getStudentInterests(
            Student student) {

        if (student.getStudentInterests() == null ||
                student.getStudentInterests().isEmpty()) {

            return "No interests available";
        }

        return student.getStudentInterests()
                .stream()
                .map(StudentInterest::getInterest)
                .filter(interest -> interest != null)
                .map(interest -> interest.getInterestName())
                .collect(Collectors.joining(", "));
    }

    // =========================================
    // Student Goals
    // =========================================

    private String getStudentGoals(
            Student student) {

        if (student.getGoals() == null ||
                student.getGoals().isEmpty()) {

            return "No goals available";
        }

        return student.getGoals()
                .stream()
                .map(this::formatGoal)
                .collect(Collectors.joining("\n"));
    }

    private String formatGoal(
            Goal goal) {

        StringBuilder result =
                new StringBuilder();

        result.append("- ")
                .append(goal.getTitle());

        if (goal.getDescription() != null &&
                !goal.getDescription().isBlank()) {

            result.append(": ")
                    .append(goal.getDescription());
        }

        if (goal.getStatus() != null) {

            result.append(" [")
                    .append(goal.getStatus())
                    .append("]");
        }

        return result.toString();
    }

    // =========================================
    // Safe Value
    // =========================================

    private String safe(Object value) {

        if (value == null) {
            return "Not provided";
        }

        return value.toString();
    }

    // =========================================
    // JSON Helper
    // =========================================

    private String getText(
            JsonNode json,
            String field) {

        JsonNode node =
                json.get(field);

        if (node == null ||
                node.isNull()) {

            return "";
        }

        if (node.isArray()) {

            StringBuilder result =
                    new StringBuilder();

            for (JsonNode item : node) {

                if (result.length() > 0) {
                    result.append("\n");
                }

                result.append(
                        item.asText()
                );
            }

            return result.toString();
        }

        return node.asText();
    }
}