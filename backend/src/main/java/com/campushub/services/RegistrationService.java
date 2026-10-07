package com.campushub.services;

import com.campushub.dto.RegistrationRequest;
import com.campushub.models.Event;
import com.campushub.models.Payment;
import com.campushub.models.Registration;
import com.campushub.models.User;
import com.campushub.repositories.EventRepository;
import com.campushub.repositories.PaymentRepository;
import com.campushub.repositories.RegistrationRepository;
import com.campushub.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public List<Registration> getRegistrationsByEvent(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return registrationRepository.findByEvent(event);
    }

    public List<Registration> getRegistrationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.findByUser(user);
    }

    public List<Registration> getRegistrationsByEmail(String email) {
        return registrationRepository.findByEmail(email);
    }

    public Registration registerForEvent(RegistrationRequest req, Long userId) {
        Event event = eventRepository.findById(req.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + req.getEventId()));

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        String formDataJson = "{}";
        if (req.getFormValues() != null) {
            try {
                formDataJson = objectMapper.writeValueAsString(req.getFormValues());
            } catch (Exception e) {
                formDataJson = "{}";
            }
        }

        String id = "reg-" + UUID.randomUUID().toString().substring(0, 8);

        Registration reg = new Registration(
                id,
                event,
                user,
                req.getStudentName(),
                req.getEnrollmentNo(),
                req.getEmail(),
                req.getPhone(),
                req.getBranch(),
                req.getYear(),
                formDataJson,
                req.getCollegeIdUrl(),
                req.getPaymentScreenshotUrl(),
                req.getTransactionRef()
        );

        // If free, approve directly, else pending admin verification
        if (!event.isPaid()) {
            reg.setStatus("APPROVED");
        } else {
            reg.setStatus("PENDING");
        }

        reg = registrationRepository.save(reg);

        // Update event registration count
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        // Create Payment record if paid
        if (event.isPaid()) {
            Payment payment = new Payment(reg, event.getRegFee(), req.getTransactionRef(), req.getPaymentScreenshotUrl());
            paymentRepository.save(payment);
        }

        return reg;
    }

    public Registration updateStatus(String registrationId, String status) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found: " + registrationId));
        reg.setStatus(status);
        return registrationRepository.save(reg);
    }
}
