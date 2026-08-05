package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddSkillRequest;
import com.nexus.backend.dto.request.UpdateSkillRequest;
import com.nexus.backend.dto.response.SkillResponse;
import com.nexus.backend.entity.Skill;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentSkill;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.SkillRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.repository.StudentSkillRepository;
import com.nexus.backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final StudentRepository studentRepository;
    private final StudentSkillRepository studentSkillRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));
    }

    // =========================================
    // Mapper
    // =========================================

    private SkillResponse mapToResponse(StudentSkill studentSkill) {

        return SkillResponse.builder()
                .id(studentSkill.getId())
                .skillName(studentSkill.getSkill().getSkillName())
                .proficiency(studentSkill.getProficiency())
                .build();
    }

    // =========================================
    // Add Skill
    // =========================================

    @Override
    public SkillResponse addSkill(AddSkillRequest request) {

        Student student = getCurrentStudent();

        Skill skill = skillRepository.findBySkillName(request.getSkillName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Skill not found."));

        if (studentSkillRepository.existsByStudentAndSkill(student, skill)) {
            throw new DuplicateResourceException("Skill already added.");
        }

        StudentSkill studentSkill = StudentSkill.builder()
                .student(student)
                .skill(skill)
                .proficiency(request.getProficiency())
                .build();

        studentSkillRepository.save(studentSkill);

        return mapToResponse(studentSkill);
    }

    // =========================================
    // Get My Skills
    // =========================================

    @Override
    public List<SkillResponse> getMySkills() {

        Student student = getCurrentStudent();

        return studentSkillRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Update Skill
    // =========================================

    @Override
    public SkillResponse updateSkill(Long id, UpdateSkillRequest request) {

        Student student = getCurrentStudent();

        StudentSkill studentSkill = studentSkillRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Skill not found."));

        studentSkill.setProficiency(request.getProficiency());

        studentSkillRepository.save(studentSkill);

        return mapToResponse(studentSkill);
    }

    // =========================================
    // Delete Skill
    // =========================================

    @Override
    public void deleteSkill(Long id) {

        Student student = getCurrentStudent();

        StudentSkill studentSkill = studentSkillRepository
                .findByIdAndStudent(id, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Skill not found."));

        studentSkillRepository.delete(studentSkill);
    }

}