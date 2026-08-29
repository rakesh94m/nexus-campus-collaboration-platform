package com.nexus.backend.service.impl;

import com.nexus.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Value("${support.email}")
    private String supportEmail;


    // ==========================================
    // SEND OTP EMAIL
    // ==========================================

    @Override
    public void sendOtpEmail(
            String email,
            String otp
    ) {

        log.info(
                "Preparing OTP email from {} to {}",
                sender,
                email
        );

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(sender);

        message.setTo(email);

        message.setSubject(
                "NEXUS Email Verification OTP"
        );

        message.setText(
                "Welcome to NEXUS!\n\n"
                        + "Your verification OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for 5 minutes."
                        + "\n\n"
                        + "Do not share this code with anyone."
        );

        try {

            log.info(
                    "Sending OTP email to {}",
                    email
            );

            mailSender.send(message);

            log.info(
                    "OTP email successfully sent to {}",
                    email
            );

        } catch (MailException exception) {

            log.error(
                    "Failed to send OTP email to {}",
                    email,
                    exception
            );

            throw new RuntimeException(
                    "Failed to send OTP email. Please try again later."
            );
        }
    }


    // ==========================================
    // SEND SUPPORT TICKET EMAIL
    // ==========================================

    @Override
    public void sendSupportTicketEmail(
            String studentName,
            String studentEmail,
            String category,
            String subject,
            String ticketMessage
    ) {

        log.info(
                "Preparing support ticket email from student {} to support {}",
                studentEmail,
                supportEmail
        );

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(sender);

        message.setTo(supportEmail);

        message.setSubject(
                "[NEXUS SUPPORT] " + subject
        );

        message.setText(
                "New Support Ticket Received\n\n"

                        + "Student Name: "
                        + studentName
                        + "\n"

                        + "Student Email: "
                        + studentEmail
                        + "\n"

                        + "Category: "
                        + category
                        + "\n\n"

                        + "Subject:\n"
                        + subject
                        + "\n\n"

                        + "Message:\n"
                        + ticketMessage
                        + "\n\n"

                        + "----------------------------------\n"
                        + "NEXUS Support System"
        );

        try {

            log.info(
                    "Sending support ticket email to {}",
                    supportEmail
            );

            mailSender.send(message);

            log.info(
                    "Support ticket email successfully sent to {}",
                    supportEmail
            );

        } catch (MailException exception) {

            log.error(
                    "Failed to send support ticket email to {}",
                    supportEmail,
                    exception
            );

            /*
             * Important:
             * The support ticket is still saved in the database.
             *
             * Email notification failure should not prevent
             * the student from creating a support ticket.
             */

            log.warn(
                    "Support ticket was saved, but email notification failed."
            );
        }
    }
}