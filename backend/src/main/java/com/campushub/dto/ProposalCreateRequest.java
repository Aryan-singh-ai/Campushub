package com.campushub.dto;

import java.time.LocalDateTime;

public class ProposalCreateRequest {
    private String title;
    private String description;
    private String clubName;
    private double estimatedBudget;
    private String proposedVenue;
    private LocalDateTime proposedDate;

    public ProposalCreateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public double getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(double estimatedBudget) { this.estimatedBudget = estimatedBudget; }

    public String getProposedVenue() { return proposedVenue; }
    public void setProposedVenue(String proposedVenue) { this.proposedVenue = proposedVenue; }

    public LocalDateTime getProposedDate() { return proposedDate; }
    public void setProposedDate(LocalDateTime proposedDate) { this.proposedDate = proposedDate; }
}
