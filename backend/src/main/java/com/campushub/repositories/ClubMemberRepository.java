package com.campushub.repositories;

import com.campushub.models.ClubMember;
import com.campushub.models.Club;
import com.campushub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    List<ClubMember> findByClub(Club club);
    List<ClubMember> findByUser(User user);
    Optional<ClubMember> findByClubAndUser(Club club, User user);
    List<ClubMember> findByClubIdAndStatus(Long clubId, String status);
}
