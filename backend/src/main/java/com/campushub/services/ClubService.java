package com.campushub.services;

import com.campushub.dto.ClubJoinRequest;
import com.campushub.models.Club;
import com.campushub.models.ClubMember;
import com.campushub.models.User;
import com.campushub.repositories.ClubMemberRepository;
import com.campushub.repositories.ClubRepository;
import com.campushub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubMemberRepository clubMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    public ClubMember joinClub(Long clubId, Long userId, ClubJoinRequest request) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<ClubMember> existing = clubMemberRepository.findByClubAndUser(club, user);
        if (existing.isPresent()) {
            return existing.get();
        }

        ClubMember member = new ClubMember(club, user, request.getPreferredRole(), "PENDING");
        member.setMotivation(request.getMotivation());
        
        // Update member count
        club.setMemberCount(club.getMemberCount() + 1);
        clubRepository.save(club);

        return clubMemberRepository.save(member);
    }

    public List<ClubMember> getClubMembers(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        return clubMemberRepository.findByClub(club);
    }

    public ClubMember updateMemberStatus(Long memberId, String status, String roleInClub) {
        ClubMember member = clubMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        if (status != null) member.setStatus(status);
        if (roleInClub != null) member.setRoleInClub(roleInClub);
        return clubMemberRepository.save(member);
    }
}
