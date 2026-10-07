package com.campushub.dto;

public class ClubJoinRequest {
    private String motivation;
    private String preferredRole = "MEMBER";

    public ClubJoinRequest() {}

    public String getMotivation() { return motivation; }
    public void setMotivation(String motivation) { this.motivation = motivation; }

    public String getPreferredRole() { return preferredRole; }
    public void setPreferredRole(String preferredRole) { this.preferredRole = preferredRole; }
}
