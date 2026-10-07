package com.campushub.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
public class Proposal {

    @Id
    private String id; // e.g. "prop-001"

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    private String clubName;
    private String submittedBy;
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    private double estimatedBudget = 0.0;
    private String proposedVenue;
    private LocalDateTime proposedDate;

    @Column(length = 2000)
    private String facultyRemarks;

    private LocalDateTime submittedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;

    public Proposal() {}

    public Proposal(String id, String title, String description, String clubName, String submittedBy, double estimatedBudget) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.clubName = clubName;
        this.submittedBy = submittedBy;
        this.estimatedBudget = estimatedBudget;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public String getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(String submittedBy) { this.submittedBy = submittedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(double estimatedBudget) { this.estimatedBudget = estimatedBudget; }

    public String getProposedVenue() { return proposedVenue; }
    public void setProposedVenue(String proposedVenue) { this.proposedVenue = proposedVenue; }

    public LocalDateTime getProposedDate() { return proposedDate; }
    public void setProposedDate(LocalDateTime proposedDate) { this.proposedDate = proposedDate; }

    public String getFacultyRemarks() { return facultyRemarks; }
    public void setFacultyRemarks(String facultyRemarks) { this.facultyRemarks = facultyRemarks; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
