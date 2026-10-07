package com.campushub.repositories;

import com.campushub.models.Registration;
import com.campushub.models.Event;
import com.campushub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String> {
    List<Registration> findByEvent(Event event);
    List<Registration> findByUser(User user);
    List<Registration> findByStatus(String status);
    List<Registration> findByEmail(String email);
    Optional<Registration> findByEventAndEmail(Event event, String email);
}
