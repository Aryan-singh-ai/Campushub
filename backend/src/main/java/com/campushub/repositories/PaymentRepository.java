package com.campushub.repositories;

import com.campushub.models.Payment;
import com.campushub.models.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(String status);
    Optional<Payment> findByRegistration(Registration registration);
}
