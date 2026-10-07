package com.campushub.controllers;

import com.campushub.dto.AnnouncementRequest;
import com.campushub.dto.ApiResponse;
import com.campushub.models.Announcement;
import com.campushub.models.User;
import com.campushub.services.AnnouncementService;
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
@RequestMapping("/api/announcements")
@Tag(name = "Announcements", description = "Endpoints for broadcasting and viewing club notices")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    @Operation(summary = "Get all announcements")
    public ResponseEntity<?> getAllAnnouncements(@RequestParam(required = false) String clubName) {
        List<Announcement> list = (clubName != null && !clubName.isBlank())
                ? announcementService.getAnnouncementsByClub(clubName)
                : announcementService.getAllAnnouncements();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("announcements", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Publish a new announcement")
    public ResponseEntity<?> createAnnouncement(@RequestBody AnnouncementRequest request, Authentication authentication) {
        try {
            String authorName = null;
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                authorName = ((User) authentication.getPrincipal()).getName();
            }
            Announcement created = announcementService.createAnnouncement(request, authorName);
            return ResponseEntity.ok(ApiResponse.ok("Announcement published successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an announcement")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return ResponseEntity.ok(ApiResponse.ok("Announcement deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
