package com.nexus.backend.service.impl;

import com.nexus.backend.dto.request.CreateSupportTicketRequest;
import com.nexus.backend.dto.request.UpdateSupportTicketStatusRequest;
import com.nexus.backend.dto.response.SupportTicketResponse;
import com.nexus.backend.entity.Student;
import com.nexus.backend.entity.SupportTicket;
import com.nexus.backend.entity.enums.Role;
import com.nexus.backend.entity.enums.SupportTicketStatus;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.exception.UnauthorizedException;
import com.nexus.backend.repository.StudentRepository;
import com.nexus.backend.repository.SupportTicketRepository;
import com.nexus.backend.security.CustomUserDetails;
import com.nexus.backend.service.EmailService;
import com.nexus.backend.service.SupportTicketService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportTicketServiceImpl
        implements SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;

    private final StudentRepository studentRepository;

    private final EmailService emailService;


    // ==========================================
    // GET CURRENT LOGGED-IN STUDENT
    // ==========================================

    private Student getCurrentStudent() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new ResourceNotFoundException(
                    "Authentication required."
            );
        }

        Object principal =
                authentication.getPrincipal();

        if (!(principal instanceof CustomUserDetails)) {

            throw new ResourceNotFoundException(
                    "Authenticated student not found."
            );
        }

        CustomUserDetails userDetails =
                (CustomUserDetails) principal;

        Long studentId =
                userDetails.getStudent().getId();

        return studentRepository
                .findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found."
                        )
                );
    }


    // ==========================================
    // GET CURRENT LOGGED-IN ADMIN
    // ==========================================

    private Student getCurrentAdmin() {

        Student currentStudent =
                getCurrentStudent();

        if (currentStudent.getRole() != Role.ADMIN) {

            throw new UnauthorizedException(
                    "You do not have permission to update support tickets."
            );
        }

        return currentStudent;
    }


    // ==========================================
    // CREATE SUPPORT TICKET
    // ==========================================

    @Override
    @Transactional
    public SupportTicketResponse createTicket(
            CreateSupportTicketRequest request
    ) {

        // Get currently logged-in student from JWT
        Student student =
                getCurrentStudent();

        // Create support ticket
        SupportTicket ticket =
                SupportTicket.builder()
                        .student(student)
                        .category(request.getCategory())
                        .subject(request.getSubject())
                        .message(request.getMessage())
                        .status(
                                SupportTicketStatus.OPEN
                        )
                        .build();

        // Save ticket
        SupportTicket savedTicket =
                supportTicketRepository.save(ticket);


        // ==========================================
        // SEND SUPPORT NOTIFICATION EMAIL
        // ==========================================

        emailService.sendSupportTicketEmail(

                student.getFirstName()
                        + " "
                        + student.getLastName(),

                student.getEmail(),

                savedTicket
                        .getCategory()
                        .name(),

                savedTicket
                        .getSubject(),

                savedTicket
                        .getMessage()
        );


        return mapToResponse(savedTicket);
    }


    // ==========================================
    // GET MY TICKETS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getMyTickets() {

        Student student =
                getCurrentStudent();

        return supportTicketRepository
                .findByStudentIdOrderByCreatedAtDesc(
                        student.getId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // GET TICKET BY ID
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public SupportTicketResponse getTicketById(
            Long ticketId
    ) {

        Student currentStudent =
                getCurrentStudent();

        SupportTicket ticket =
                supportTicketRepository
                        .findById(ticketId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Support ticket not found."
                                )
                        );


        // ==========================================
        // ADMIN CAN VIEW ANY TICKET
        // ==========================================

        if (currentStudent.getRole() == Role.ADMIN) {

            return mapToResponse(ticket);
        }


        // ==========================================
        // STUDENT CAN ONLY VIEW OWN TICKET
        // ==========================================

        if (!ticket.getStudent()
                .getId()
                .equals(currentStudent.getId())) {

            throw new UnauthorizedException(
                    "You do not have permission to view this ticket."
            );
        }

        return mapToResponse(ticket);
    }


    // ==========================================
    // UPDATE SUPPORT TICKET STATUS
    // ADMIN ONLY
    // ==========================================

    @Override
    @Transactional
    public SupportTicketResponse updateTicketStatus(
            Long ticketId,
            UpdateSupportTicketStatusRequest request
    ) {

        // ==========================================
        // SECURITY CHECK
        // Only ADMIN can update ticket status
        // ==========================================

        getCurrentAdmin();


        SupportTicket ticket =
                supportTicketRepository
                        .findById(ticketId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Support ticket not found."
                                )
                        );


        // ==========================================
        // UPDATE STATUS
        // ==========================================

        ticket.setStatus(
                request.getStatus()
        );


        SupportTicket updatedTicket =
                supportTicketRepository.save(ticket);

        return mapToResponse(updatedTicket);
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private SupportTicketResponse mapToResponse(
            SupportTicket ticket
    ) {

        return SupportTicketResponse
                .builder()

                .id(ticket.getId())

                .studentId(
                        ticket.getStudent().getId()
                )

                .category(
                        ticket.getCategory()
                )

                .subject(
                        ticket.getSubject()
                )

                .message(
                        ticket.getMessage()
                )

                .status(
                        ticket.getStatus()
                )

                .createdAt(
                        ticket.getCreatedAt()
                )

                .updatedAt(
                        ticket.getUpdatedAt()
                )

                .build();
    }
}