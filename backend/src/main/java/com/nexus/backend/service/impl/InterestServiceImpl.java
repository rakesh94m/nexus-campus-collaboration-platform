package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.AddInterestRequest;
import com.nexus.backend.dto.request.UpdateInterestRequest;
import com.nexus.backend.dto.response.InterestResponse;
import com.nexus.backend.entity.Interest;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.StudentInterest;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.InterestRepository;
import com.nexus.backend.repository.StudentInterestRepository;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterestServiceImpl implements InterestService {

    private final InterestRepository interestRepository;
    private final StudentRepository studentRepository;
    private final StudentInterestRepository studentInterestRepository;

    // =========================================
    // Get Logged-in Student
    // =========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found."
                        ));
    }

    // =========================================
    // Mapper
    // =========================================

    private InterestResponse mapToResponse(
            StudentInterest studentInterest) {

        return InterestResponse.builder()
                .id(studentInterest.getId())
                .interestName(
                        studentInterest
                                .getInterest()
                                .getInterestName()
                )
                .build();
    }

    // =========================================
    // Add Interest
    //
    // If interest exists:
    //     use existing interest
    //
    // If interest does not exist:
    //     create new interest
    //
    // Then associate it with logged-in student.
    // =========================================

    @Override
    @Transactional
    public InterestResponse addInterest(
            AddInterestRequest request) {

        Student student = getCurrentStudent();

        String interestName =
                request.getInterestName()
                        .trim();

        // =========================================
        // Find existing interest
        // =========================================

        Interest interest =
                interestRepository
                        .findByInterestName(
                                interestName
                        )
                        .orElse(null);

        // =========================================
        // Create interest if it doesn't exist
        // =========================================

        if (interest == null) {

            interest =
                    Interest.builder()
                            .interestName(interestName)
                            .build();

            interest =
                    interestRepository.save(
                            interest
                    );
        }

        // =========================================
        // Prevent duplicate student interest
        // =========================================

        if (studentInterestRepository
                .existsByStudentAndInterest(
                        student,
                        interest
                )) {

            throw new DuplicateResourceException(
                    "Interest already added."
            );
        }

        // =========================================
        // Create student-interest relationship
        // =========================================

        StudentInterest studentInterest =
                StudentInterest.builder()
                        .student(student)
                        .interest(interest)
                        .build();

        studentInterest =
                studentInterestRepository.save(
                        studentInterest
                );

        return mapToResponse(
                studentInterest
        );
    }

    // =========================================
    // Get My Interests
    // =========================================

    @Override
    public List<InterestResponse> getMyInterests() {

        Student student = getCurrentStudent();

        return studentInterestRepository
                .findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
    // Update Interest
    // =========================================

    @Override
    public InterestResponse updateInterest(
            Long id,
            UpdateInterestRequest request) {

        Student student = getCurrentStudent();

        StudentInterest studentInterest =
                studentInterestRepository
                        .findByIdAndStudent(
                                id,
                                student
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interest not found."
                                ));

        return mapToResponse(
                studentInterest
        );
    }

    // =========================================
    // Delete Interest
    // =========================================

    @Override
    public void deleteInterest(Long id) {

        Student student = getCurrentStudent();

        StudentInterest studentInterest =
                studentInterestRepository
                        .findByIdAndStudent(
                                id,
                                student
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interest not found."
                                ));

        studentInterestRepository.delete(
                studentInterest
        );
    }
}