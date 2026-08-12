package com.nexus.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.nexus.backend.dto.response.GeminiRecommendationResponse;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentInterest;
import com.nexus.backend.entity.StudentSkill;
import com.nexus.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl
        implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    // =========================================
    // Generate Recommendation
    // =========================================

    @Override
    public GeminiRecommendationResponse generateRecommendation(
            Student student,
            Project project,
            Double matchScore) {

        try {

            Client client =
                    Client.builder()
                            .apiKey(apiKey)
                            .build();

            String prompt =
                    buildPrompt(
                            student,
                            project,
                            matchScore
                    );

            GenerateContentResponse response =
                    client.models.generateContent(
                            model,
                            prompt,
                            null
                    );

            String responseText =
                    response.text();

            if (responseText == null ||
                    responseText.isBlank()) {

                return getFallbackResponse();
            }

            // =========================================
            // Clean possible markdown wrappers
            // =========================================

            responseText =
                    responseText
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();

            JsonNode json =
                    objectMapper.readTree(
                            responseText
                    );

            return GeminiRecommendationResponse
                    .builder()
                    .reason(
                            getText(
                                    json,
                                    "reason"
                            )
                    )
                    .missingSkills(
                            getArrayAsString(
                                    json,
                                    "missingSkills",
                                    ", "
                            )
                    )
                    .learningRoadmap(
                            getArrayAsString(
                                    json,
                                    "learningRoadmap",
                                    "\n"
                            )
                    )
                    .careerAdvice(
                            getText(
                                    json,
                                    "careerAdvice"
                            )
                    )
                    .recommendedCertification(
                            getText(
                                    json,
                                    "recommendedCertification"
                            )
                    )
                    .build();

        } catch (Exception e) {

            System.err.println(
                    "Gemini recommendation error: "
                            + e.getMessage()
            );

            return getFallbackResponse();
        }
    }

    // =========================================
    // Build Gemini Prompt
    // =========================================

    private String buildPrompt(
            Student student,
            Project project,
            Double score) {

        return """
                You are an expert AI Career Mentor.

                Analyze the student's profile and the recommended project.

                ## Student Details

                Name: %s %s
                Department: %s
                Specialization: %s
                CGPA: %s
                Availability: %s

                Skills:
                %s

                Matched Skills:
                %s

                Missing Skills:
                %s

                Interests:
                %s

                ## Project Details

                Title: %s
                Technologies: %s
                Description: %s

                Recommendation Score: %.2f%%

                Instructions:

                - Keep the total response concise.
                - Be professional and useful.
                - Do NOT repeat the student's profile.
                - Do NOT explain how the score was calculated.
                - Focus only on:
                  1. Why this project is suitable.
                  2. Missing skills.
                  3. Learning roadmap with 3-4 steps.
                  4. Career advice.
                  5. One specific recommended certification.

                Return ONLY valid JSON.

                {
                  "reason": "",
                  "missingSkills": [],
                  "learningRoadmap": [],
                  "careerAdvice": "",
                  "recommendedCertification": ""
                }

                Do not return markdown.
                Do not wrap JSON inside markdown code blocks.
                Return only the JSON object.
                """.formatted(

                student.getFirstName(),
                student.getLastName(),

                safe(student.getDepartment()),

                safe(student.getSpecialization()),

                student.getCgpa() != null
                        ? student.getCgpa()
                        : 0.0,

                safe(
                        student
                                .getAvailabilityStatus()
                                != null
                                ? student
                                        .getAvailabilityStatus()
                                        .name()
                                : null
                ),

                getStudentSkills(student),

                getMatchedSkills(
                        student,
                        project
                ),

                getMissingSkills(
                        student,
                        project
                ),

                getStudentInterests(student),

                safe(project.getProjectTitle()),

                safe(project.getTechnologiesUsed()),

                safe(project.getDescription()),

                score
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
                .filter(skill ->
                        skill != null &&
                        skill.getSkill() != null &&
                        skill.getSkill()
                                .getSkillName() != null
                )
                .map(StudentSkill::getSkill)
                .map(skill ->
                        skill.getSkillName()
                )
                .collect(
                        Collectors.joining(", ")
                );
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
                .filter(interest ->
                        interest != null &&
                        interest.getInterest() != null &&
                        interest.getInterest()
                                .getInterestName() != null
                )
                .map(StudentInterest::getInterest)
                .map(interest ->
                        interest.getInterestName()
                )
                .collect(
                        Collectors.joining(", ")
                );
    }

    // =========================================
    // Matched Skills
    // =========================================

    private String getMatchedSkills(
            Student student,
            Project project) {

        if (student.getStudentSkills() == null ||
                student.getStudentSkills().isEmpty() ||
                project.getTechnologiesUsed() == null) {

            return "None";
        }

        String technologies =
                project.getTechnologiesUsed()
                        .toLowerCase();

        return student.getStudentSkills()
                .stream()
                .filter(skill ->
                        skill != null &&
                        skill.getSkill() != null &&
                        skill.getSkill()
                                .getSkillName() != null
                )
                .map(skill ->
                        skill.getSkill()
                                .getSkillName()
                )
                .filter(skill ->
                        technologies.contains(
                                skill.toLowerCase()
                        )
                )
                .collect(
                        Collectors.joining(", ")
                );
    }

    // =========================================
    // Missing Skills
    // =========================================

    private String getMissingSkills(
            Student student,
            Project project) {

        if (project.getTechnologiesUsed() == null) {

            return "None";
        }

        List<String> studentSkills =
                student.getStudentSkills() == null
                        ? List.of()
                        : student.getStudentSkills()
                        .stream()
                        .filter(skill ->
                                skill != null &&
                                skill.getSkill() != null &&
                                skill.getSkill()
                                        .getSkillName() != null
                        )
                        .map(skill ->
                                skill.getSkill()
                                        .getSkillName()
                                        .toLowerCase()
                                        .trim()
                        )
                        .toList();

        return Arrays.stream(
                        project
                                .getTechnologiesUsed()
                                .split(",")
                )
                .map(String::trim)
                .filter(skill ->
                        !skill.isEmpty()
                )
                .filter(skill ->
                        !studentSkills.contains(
                                skill.toLowerCase()
                        )
                )
                .collect(
                        Collectors.joining(", ")
                );
    }

    // =========================================
    // Safe String
    // =========================================

    private String safe(String value) {

        return value == null
                ? "Not specified"
                : value;
    }

    // =========================================
    // Read JSON Text
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

        return node.asText();
    }

    // =========================================
    // Read JSON Array
    // =========================================

    private String getArrayAsString(
            JsonNode json,
            String field,
            String separator) {

        JsonNode node =
                json.get(field);

        if (node == null ||
                node.isNull()) {

            return "";
        }

        if (node.isArray()) {

            List<String> values =
                    objectMapper.convertValue(
                            node,
                            List.class
                    );

            return String.join(
                    separator,
                    values
            );
        }

        return node.asText();
    }

    // =========================================
    // Fallback Response
    // =========================================

    private GeminiRecommendationResponse
    getFallbackResponse() {

        return GeminiRecommendationResponse
                .builder()
                .reason(
                        "This project matches your profile based on your current skills and interests."
                )
                .missingSkills(
                        "Review the project technologies to identify additional skills."
                )
                .learningRoadmap(
                        "1. Learn the missing technologies.\n" +
                        "2. Build a small practice project.\n" +
                        "3. Apply the skills to this project."
                )
                .careerAdvice(
                        "Continue building practical projects and strengthen the technologies required for your target role."
                )
                .recommendedCertification(
                        "Consider a certification related to the project's main technology."
                )
                .build();
    }
}