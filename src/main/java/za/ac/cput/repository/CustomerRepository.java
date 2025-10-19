package za.ac.cput.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import za.ac.cput.domain.UType.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findByPaymentMethod(String paymentMethod);
    Customer findByEmailAndPassword(String email, String password);
    Customer findByEmail(String email);
    Customer findByEmailIgnoreCase(String email);
}
