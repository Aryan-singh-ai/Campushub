package com.campushub.controllers;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.ProposalCreateRequest;
import com.campushub.dto.ProposalReviewRequest;
import com.campushub.models.Proposal;
import com.campushub.models.User;
import com.campushub.services.ProposalService;
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
@RequestMapping("/api/proposals")
@Tag(name = "Proposals", description = "Endpoints for club event proposal drafting and faculty review")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @GetMapping
    @Operation(summary = "Get all event proposals")
    public ResponseEntity<?> getAllProposals(@RequestParam(required = false) String clubName) {
        List<Proposal> list = (clubName != null && !clubName.isBlank()) 
                ? proposalService.getProposalsByClub(clubName) 
                : proposalService.getAllProposals();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("proposals", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Submit a new proposal to faculty coordinator")
    public ResponseEntity<?> createProposal(@RequestBody ProposalCreateRequest request, Authentication authentication) {
        try {
            String submittedBy = null;
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                submittedBy = ((User) authentication.getPrincipal()).getName();
            }
            Proposal proposal = proposalService.createProposal(request, submittedBy);
            return ResponseEntity.ok(ApiResponse.ok("Proposal submitted successfully", proposal));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/review")
    @Operation(summary = "Faculty coordinator approval or rejection of proposal")
    public ResponseEntity<?> reviewProposal(@PathVariable String id, @RequestBody ProposalReviewRequest request) {
        try {
            Proposal proposal = proposalService.reviewProposal(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Proposal review recorded", proposal));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
