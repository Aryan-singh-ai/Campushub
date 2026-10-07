package com.campushub.controllers;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.RegistrationRequest;
import com.campushub.models.Registration;
import com.campushub.models.User;
import com.campushub.services.RegistrationService;
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
@RequestMapping("/api/registrations")
@Tag(name = "Registrations", description = "Endpoints for event ticket bookings and registration processing")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping
    @Operation(summary = "Get all registrations (Admin / Officer view)")
    public ResponseEntity<?> getAllRegistrations() {
        List<Registration> list = registrationService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.ok("Registrations fetched", list));
    }

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get all registrations for a specific event")
    public ResponseEntity<?> getRegistrationsByEvent(@PathVariable String eventId) {
        List<Registration> list = registrationService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event registrations fetched", list));
    }

    @GetMapping("/my")
    @Operation(summary = "Get registrations for current logged-in user")
    public ResponseEntity<?> getMyRegistrations(Authentication authentication, @RequestParam(required = false) String email) {
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            List<Registration> list = registrationService.getRegistrationsByUser(user.getId());
            return ResponseEntity.ok(ApiResponse.ok("My registrations fetched", list));
        } else if (email != null && !email.isBlank()) {
            List<Registration> list = registrationService.getRegistrationsByEmail(email);
            return ResponseEntity.ok(ApiResponse.ok("My registrations fetched", list));
        }
        return ResponseEntity.ok(ApiResponse.ok("My registrations fetched", List.of()));
    }

    @PostMapping
    @Operation(summary = "Submit a new event registration form with document uploads")
    public ResponseEntity<?> registerForEvent(@RequestBody RegistrationRequest request, Authentication authentication) {
        try {
            Long userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                userId = ((User) authentication.getPrincipal()).getId();
            }
            Registration reg = registrationService.registerForEvent(request, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("registration", reg);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Approve or reject a registration")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestParam String status) {
        try {
            Registration reg = registrationService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.ok("Registration status updated", reg));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
