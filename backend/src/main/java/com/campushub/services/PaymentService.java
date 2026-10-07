package com.campushub.services;

import com.campushub.dto.PaymentReviewRequest;
import com.campushub.models.Payment;
import com.campushub.models.Registration;
import com.campushub.repositories.PaymentRepository;
import com.campushub.repositories.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPendingPayments() {
        return paymentRepository.findByStatus("PENDING");
    }

    public Payment reviewPayment(Long paymentId, PaymentReviewRequest req, String adminName) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found: " + paymentId));

        payment.setStatus(req.getStatus());
        payment.setRemarks(req.getRemarks());
        payment.setReviewedBy(adminName != null ? adminName : "System Admin");
        payment.setReviewedAt(LocalDateTime.now());

        // Update registration status accordingly
        Registration reg = payment.getRegistration();
        if (reg != null) {
            if ("VERIFIED".equalsIgnoreCase(req.getStatus()) || "APPROVED".equalsIgnoreCase(req.getStatus())) {
                reg.setStatus("APPROVED");
            } else if ("REJECTED".equalsIgnoreCase(req.getStatus())) {
                reg.setStatus("REJECTED");
            }
            registrationRepository.save(reg);
        }

        return paymentRepository.save(payment);
    }
}
