package com.nexus.backend.service.impl;

import com.nexus.backend.dto.response.ProjectSearchResponse;
import com.nexus.backend.dto.response.StudentSearchResponse;
import com.nexus.backend.entity.Project;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentSkill;
import com.nexus.backend.entity.enums.AvailabilityStatus;
import com.nexus.backend.repository.ProjectRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.repository.StudentSkillRepository;
import com.nexus.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final StudentRepository studentRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRepository projectRepository;

    @Override
    public List<StudentSearchResponse> searchStudentsByName(String name) {

        return studentRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        name,
                        name)
                .stream()
                .map(this::mapStudent)
                .toList();
    }

    @Override
    public List<StudentSearchResponse> searchStudentsByDepartment(String department) {

        return studentRepository
                .findByDepartmentIgnoreCase(department)
                .stream()
                .map(this::mapStudent)
                .toList();
    }

    @Override
    public List<StudentSearchResponse> searchStudentsByAvailability(
            AvailabilityStatus availabilityStatus) {

        return studentRepository
                .findByAvailabilityStatus(availabilityStatus)
                .stream()
                .map(this::mapStudent)
                .toList();
    }

    @Override
    public List<StudentSearchResponse> searchStudentsBySkill(String skill) {

        return studentSkillRepository
                .findBySkillSkillNameContainingIgnoreCase(skill)
                .stream()
                .map(StudentSkill::getStudent)
                .distinct()
                .map(this::mapStudent)
                .toList();
    }

    @Override
    public List<ProjectSearchResponse> searchProjectsByTitle(String title) {

        return projectRepository
                .findByProjectTitleContainingIgnoreCase(title)
                .stream()
                .map(this::mapProject)
                .toList();
    }

    @Override
    public List<ProjectSearchResponse> searchProjectsByTechnology(String technology) {

        return projectRepository
                .findByTechnologiesUsedContainingIgnoreCase(technology)
                .stream()
                .map(this::mapProject)
                .toList();
    }

    private StudentSearchResponse mapStudent(Student student) {

        return StudentSearchResponse.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .department(student.getDepartment())
                .specialization(student.getSpecialization())
                .year(student.getYear())
                .cgpa(student.getCgpa())
                .availabilityStatus(student.getAvailabilityStatus())
                .build();
    }

    private ProjectSearchResponse mapProject(Project project) {

        return ProjectSearchResponse.builder()
                .id(project.getId())
                .projectTitle(project.getProjectTitle())
                .description(project.getDescription())
                .technologiesUsed(project.getTechnologiesUsed())
                .githubUrl(project.getGithubUrl())
                .liveDemoUrl(project.getLiveDemoUrl())
                .build();
    }

}