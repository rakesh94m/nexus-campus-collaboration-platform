package com.nexus.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.nexus.backend.dto.response.GeminiRecommendationResponse;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.nexus.backend.entity.StudentInterest;
import com.nexus.backend.entity.StudentSkill;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public GeminiRecommendationResponse generateRecommendation(
            Student student,
            Project project,
            Double matchScore) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = buildPrompt(student, project, matchScore);

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );

        try {
            JsonNode json = objectMapper.readTree(response.text());

            return GeminiRecommendationResponse.builder()
                    .reason(json.get("reason").asText())
                    .missingSkills(
                            String.join(", ",
                                    objectMapper.convertValue(
                                            json.get("missingSkills"),
                                            java.util.List.class))
                    )
                    .learningRoadmap(
                            String.join("\n",
                                    objectMapper.convertValue(
                                            json.get("learningRoadmap"),
                                            java.util.List.class))
                    )
                    .careerAdvice(json.get("careerAdvice").asText())
                    .recommendedCertification(json.get("recommendedCertification").asText())
                    .build();

        } catch (Exception e) {
            return GeminiRecommendationResponse.builder()
                    .reason("Unable to generate AI recommendation.")
                    .missingSkills("")
                    .learningRoadmap("")
                    .careerAdvice("")
                    .recommendedCertification("")
                    .build();
        }
    }

    private String buildPrompt(
            Student student,
            Project project,
            Double score) {

        return """
You are an expert AI Career Mentor.

Analyze the student's profile and the recommended project.

Student Details
---------------
Name: %s %s
Department: %s
Specialization: %s
CGPA: %.2f
Availability: %s

Skills:
%s

Matched Skills:
%s

Missing Skills:
%s

Interests:
%s

Project Details
---------------
Title: %s
Technologies: %s
Description: %s

Recommendation Score: %.2f%%

Instructions:
- Keep the total response under 120 words.
- Be concise and professional.
- Do NOT repeat the student's profile.
- Do NOT explain how the score was calculated.
- Focus only on:
  1. Why this project is suitable.
  2. Missing skills.
  3. Learning roadmap (3-4 steps).
  4. Career advice.
  5. A specific recommended certification.

Return ONLY valid JSON.

{
  "reason":"",
  "missingSkills":[],
  "learningRoadmap":[],
  "careerAdvice":"",
  "recommendedCertification":""
}

Do not return markdown.
Do not wrap JSON inside ```json.
Return only the JSON object.
""".formatted(
                student.getFirstName(),
                student.getLastName(),
                student.getDepartment(),
                student.getSpecialization(),
                student.getCgpa(),
                student.getAvailabilityStatus(),
                getStudentSkills(student),
                getMatchedSkills(student, project),
                getMissingSkills(student, project),
                getStudentInterests(student),
                project.getProjectTitle(),
                project.getTechnologiesUsed(),
                project.getDescription(),
                score
        );
    }

    private String getStudentSkills(Student student) {

        if (student.getStudentSkills() == null || student.getStudentSkills().isEmpty()) {
            return "No skills available";
        }

        return student.getStudentSkills()
                .stream()
                .map(StudentSkill::getSkill)
                .map(skill -> skill.getSkillName())
                .collect(Collectors.joining(", "));
    }

    private String getStudentInterests(Student student) {

        if (student.getStudentInterests() == null || student.getStudentInterests().isEmpty()) {
            return "No interests available";
        }

        return student.getStudentInterests()
                .stream()
                .map(StudentInterest::getInterest)
                .map(interest -> interest.getInterestName())
                .collect(Collectors.joining(", "));
    }

    private String getMatchedSkills(Student student, Project project) {

        if (student.getStudentSkills() == null || project.getTechnologiesUsed() == null) {
            return "None";
        }

        return student.getStudentSkills()
                .stream()
                .map(skill -> skill.getSkill().getSkillName())
                .filter(skill ->
                        project.getTechnologiesUsed()
                                .toLowerCase()
                                .contains(skill.toLowerCase()))
                .collect(Collectors.joining(", "));
    }

    private String getMissingSkills(Student student, Project project) {

        if (project.getTechnologiesUsed() == null) {
            return "None";
        }

        List<String> studentSkills = student.getStudentSkills()
                .stream()
                .map(skill -> skill.getSkill().getSkillName().toLowerCase())
                .toList();

        return java.util.Arrays.stream(project.getTechnologiesUsed().split(","))
                .map(String::trim)
                .filter(skill ->
                        !studentSkills.contains(skill.toLowerCase()))
                .collect(Collectors.joining(", "));
    }
}