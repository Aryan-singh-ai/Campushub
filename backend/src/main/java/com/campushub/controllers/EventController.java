package com.campushub.controllers;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.EventCreateRequest;
import com.campushub.models.Event;
import com.campushub.services.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Events", description = "Endpoints for exploring, proposing, and managing campus events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    @Operation(summary = "Get all events")
    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("events", events);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event details and dynamic registration form by ID")
    public ResponseEntity<?> getEventById(@PathVariable String id) {
        return eventService.getEventById(id)
                .map(event -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("event", event);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create or publish a new event")
    public ResponseEntity<?> createEvent(@RequestBody EventCreateRequest request) {
        try {
            Event event = eventService.createEvent(request);
            return ResponseEntity.ok(ApiResponse.ok("Event created successfully", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing event")
    public ResponseEntity<?> updateEvent(@PathVariable String id, @RequestBody EventCreateRequest request) {
        try {
            Event event = eventService.updateEvent(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Event updated successfully", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
