package com.campushub.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_members")
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String roleInClub; // PRESIDENT, VICE_PRESIDENT, SECRETARY, TREASURER, MEMBER, APPLICANT
    private String status = "APPROVED"; // PENDING, APPROVED, REJECTED
    private String motivation;

    private LocalDateTime joinedAt = LocalDateTime.now();

    public ClubMember() {}

    public ClubMember(Club club, User user, String roleInClub, String status) {
        this.club = club;
        this.user = user;
        this.roleInClub = roleInClub;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRoleInClub() { return roleInClub; }
    public void setRoleInClub(String roleInClub) { this.roleInClub = roleInClub; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMotivation() { return motivation; }
    public void setMotivation(String motivation) { this.motivation = motivation; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
