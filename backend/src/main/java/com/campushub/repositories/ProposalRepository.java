package com.campushub.repositories;

import com.campushub.models.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, String> {
    List<Proposal> findByStatus(String status);
    List<Proposal> findByClubName(String clubName);
}
