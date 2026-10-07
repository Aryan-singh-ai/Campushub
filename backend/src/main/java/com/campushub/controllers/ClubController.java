package com.campushub.controllers;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.ClubJoinRequest;
import com.campushub.models.Club;
import com.campushub.models.ClubMember;
import com.campushub.models.User;
import com.campushub.services.ClubService;
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
@RequestMapping("/api/clubs")
@Tag(name = "Clubs", description = "Endpoints for exploring clubs, submitting membership requests, and roster management")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping
    @Operation(summary = "Get list of all university clubs")
    public ResponseEntity<?> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("clubs", clubs);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific club details")
    public ResponseEntity<?> getClubById(@PathVariable Long id) {
        return clubService.getClubById(id)
                .map(club -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("club", club);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a new club profile")
    public ResponseEntity<?> createClub(@RequestBody Club club) {
        try {
            Club created = clubService.createClub(club);
            return ResponseEntity.ok(ApiResponse.ok("Club created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Submit a membership application to join a club")
    public ResponseEntity<?> joinClub(@PathVariable Long id,
                                     @RequestBody ClubJoinRequest request,
                                     Authentication authentication) {
        try {
            Long userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                userId = ((User) authentication.getPrincipal()).getId();
            } else {
                userId = 1L; // Fallback to demo student
            }
            ClubMember member = clubService.joinClub(id, userId, request);
            return ResponseEntity.ok(ApiResponse.ok("Club join application submitted successfully", member));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "Get roster of members in a club")
    public ResponseEntity<?> getClubMembers(@PathVariable Long id) {
        try {
            List<ClubMember> members = clubService.getClubMembers(id);
            return ResponseEntity.ok(ApiResponse.ok("Members retrieved", members));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
