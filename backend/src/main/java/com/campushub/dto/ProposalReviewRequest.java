package com.campushub.dto;

public class ProposalReviewRequest {
    private String status; // APPROVED, REJECTED
    private String facultyRemarks;

    public ProposalReviewRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFacultyRemarks() { return facultyRemarks; }
    public void setFacultyRemarks(String facultyRemarks) { this.facultyRemarks = facultyRemarks; }
}
