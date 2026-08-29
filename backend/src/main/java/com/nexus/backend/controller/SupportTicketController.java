package com.nexus.backend.controller;

import com.nexus.backend.dto.request.CreateSupportTicketRequest;
import com.nexus.backend.dto.request.UpdateSupportTicketStatusRequest;
import com.nexus.backend.dto.response.SupportTicketResponse;
import com.nexus.backend.service.SupportTicketService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;


    // ==========================================
    // CREATE SUPPORT TICKET
    // ==========================================

    @PostMapping
    public ResponseEntity<SupportTicketResponse> createTicket(
            @Valid
            @RequestBody
            CreateSupportTicketRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        supportTicketService
                                .createTicket(request)
                );
    }


    // ==========================================
    // GET MY SUPPORT TICKETS
    // ==========================================

    @GetMapping("/my")
    public ResponseEntity<
            List<SupportTicketResponse>
            > getMyTickets() {

        return ResponseEntity.ok(
                supportTicketService
                        .getMyTickets()
        );
    }


    // ==========================================
    // GET SUPPORT TICKET BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<
            SupportTicketResponse
            > getTicketById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                supportTicketService
                        .getTicketById(id)
        );
    }


    // ==========================================
    // UPDATE SUPPORT TICKET STATUS
    // ==========================================

    @PutMapping("/{id}/status")
    public ResponseEntity<
            SupportTicketResponse
            > updateTicketStatus(

            @PathVariable Long id,

            @Valid
            @RequestBody
            UpdateSupportTicketStatusRequest request
    ) {

        return ResponseEntity.ok(
                supportTicketService
                        .updateTicketStatus(
                                id,
                                request
                        )
        );
    }
}