package com.nexus.backend.service;

import com.nexus.backend.dto.request.CreateSupportTicketRequest;
import com.nexus.backend.dto.request.UpdateSupportTicketStatusRequest;
import com.nexus.backend.dto.response.AdminSupportTicketResponse;
import com.nexus.backend.dto.response.SupportTicketResponse;
import java.util.List;

public interface SupportTicketService {

    // ==========================================
    // CREATE SUPPORT TICKET
    // ==========================================

    SupportTicketResponse createTicket(
            CreateSupportTicketRequest request
    );

    // ==========================================
    // GET LOGGED-IN STUDENT'S TICKETS
    // ==========================================

    List<SupportTicketResponse> getMyTickets();

    // ==========================================
    // GET ONE TICKET
    // ==========================================

    SupportTicketResponse getTicketById(
            Long ticketId
    );

    SupportTicketResponse updateTicketStatus(
            Long id,
            UpdateSupportTicketStatusRequest request
    );

    // ==========================================
    // GET ALL TICKETS (ADMIN ONLY)
    // ==========================================

    List<AdminSupportTicketResponse> getAllTicketsForAdmin();
}