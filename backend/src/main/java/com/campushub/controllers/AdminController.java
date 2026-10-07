package com.campushub.controllers;

import com.campushub.dto.ApiResponse;
import com.campushub.models.Role;
import com.campushub.models.User;
import com.campushub.repositories.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Endpoints for administrator analytics, user directory, and system controls")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get system-wide dashboard analytics and metrics")
    public ResponseEntity<?> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalClubs", clubRepository.count());
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalRegistrations", registrationRepository.count());
        stats.put("pendingProposals", proposalRepository.findByStatus("PENDING").size());
        stats.put("pendingPayments", paymentRepository.findByStatus("PENDING").size());
        
        return ResponseEntity.ok(ApiResponse.ok("System statistics retrieved", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Users list retrieved", users));
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update a user's role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("User role updated", user));
    }
}
