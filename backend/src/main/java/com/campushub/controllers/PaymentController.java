package com.campushub.controllers;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.PaymentReviewRequest;
import com.campushub.models.Payment;
import com.campushub.models.User;
import com.campushub.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Endpoints for verifying student payment transactions and receipts")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get all payments")
    public ResponseEntity<?> getAllPayments(@RequestParam(required = false) String status) {
        List<Payment> list = "PENDING".equalsIgnoreCase(status)
                ? paymentService.getPendingPayments()
                : paymentService.getAllPayments();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("payments", list);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/verify")
    @Operation(summary = "Verify or reject a student payment transaction")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id,
                                          @RequestBody PaymentReviewRequest request,
                                          Authentication authentication) {
        try {
            String adminName = null;
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                adminName = ((User) authentication.getPrincipal()).getName();
            }
            Payment updated = paymentService.reviewPayment(id, request, adminName);
            return ResponseEntity.ok(ApiResponse.ok("Payment status updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
