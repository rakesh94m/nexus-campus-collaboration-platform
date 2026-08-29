package com.nexus.backend.service;

public interface EmailService {

    // ==========================================
    // OTP EMAIL
    // ==========================================

    void sendOtpEmail(
            String email,
            String otp
    );

    // ==========================================
    // SUPPORT TICKET EMAIL
    // ==========================================

    void sendSupportTicketEmail(
            String studentName,
            String studentEmail,
            String category,
            String subject,
            String ticketMessage
    );
}