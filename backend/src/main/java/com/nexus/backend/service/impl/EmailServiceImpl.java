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
}