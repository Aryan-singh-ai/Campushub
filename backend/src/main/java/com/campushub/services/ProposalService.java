package com.campushub.services;

import com.campushub.dto.ProposalCreateRequest;
import com.campushub.dto.ProposalReviewRequest;
import com.campushub.models.Proposal;
import com.campushub.repositories.ProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

    public List<Proposal> getAllProposals() {
        return proposalRepository.findAll();
    }

    public List<Proposal> getProposalsByClub(String clubName) {
        return proposalRepository.findByClubName(clubName);
    }

    public Proposal createProposal(ProposalCreateRequest req, String submittedBy) {
        String id = "prop-" + UUID.randomUUID().toString().substring(0, 8);
        Proposal proposal = new Proposal(
                id,
                req.getTitle(),
                req.getDescription(),
                req.getClubName(),
                submittedBy != null ? submittedBy : "Club Lead",
                req.getEstimatedBudget()
        );
        proposal.setProposedVenue(req.getProposedVenue());
        proposal.setProposedDate(req.getProposedDate());

        return proposalRepository.save(proposal);
    }

    public Proposal reviewProposal(String id, ProposalReviewRequest req) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposal not found: " + id));

        if (req.getStatus() != null) {
            proposal.setStatus(req.getStatus());
        }
        if (req.getFacultyRemarks() != null) {
            proposal.setFacultyRemarks(req.getFacultyRemarks());
        }
        proposal.setReviewedAt(LocalDateTime.now());

        return proposalRepository.save(proposal);
    }
}
