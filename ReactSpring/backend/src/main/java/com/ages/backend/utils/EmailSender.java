package com.ages.backend.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSender {

    @Value("${spring.mail.username}")
    private String from;
    private final JavaMailSender mailSender;

    public void sendGreetingsMail(String to, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(from);
        mailMessage.setTo(to);
        mailMessage.setSubject("Greetings");
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }
}
