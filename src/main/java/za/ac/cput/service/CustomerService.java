package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.UType.Customer;
import za.ac.cput.repository.CustomerRepository;

import java.util.List;
import java.util.UUID;
import java.util.Locale;

@Service
public class CustomerService implements ICustomerService {

    private final CustomerRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomerService(CustomerRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
    }

    @Override
    public Customer create(Customer customer) {
        Customer preparedCustomer = prepareCustomerForPersistence(customer);
        return repository.save(preparedCustomer);
    }

    @Override
    public Customer read(UUID id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Customer update(Customer customer) {
        if (repository.existsById(customer.getUserId())) {
            Customer preparedCustomer = prepareCustomerForPersistence(customer);
            return repository.save(preparedCustomer);
        }
        return null;
    }

    @Override
    public boolean delete(UUID id) {
        repository.deleteById(id);
        return !repository.existsById(id);
    }

    @Override
    public List<Customer> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Customer> findByPaymentMethod(String paymentMethod){
        return repository.findByPaymentMethod(paymentMethod);
        }

    @Override
    public Customer login(String email, String password) {
        if (email == null || password == null) {
            return null;
        }

        Customer storedCustomer = repository.findByEmailIgnoreCase(email.trim().toLowerCase());
        if (storedCustomer != null && passwordEncoder.matches(password, storedCustomer.getPassword())) {
            return storedCustomer;
        }

        return null;
    }

    private Customer prepareCustomerForPersistence(Customer customer) {
        Customer.Builder builder = new Customer.Builder().copy(customer);
        String resolvedRole = customer.getRole() == null ? "CUSTOMER" : customer.getRole().toUpperCase(Locale.ROOT);
        builder.setRole(resolvedRole);
        builder.setPassword(encodeIfNeeded(customer.getPassword()));
        return builder.build();
    }

    private String encodeIfNeeded(String candidate) {
        if (candidate == null || candidate.isBlank()) {
            return candidate;
        }

        String trimmed = candidate.trim();
        if (trimmed.startsWith("$2a$") || trimmed.startsWith("$2b$") || trimmed.startsWith("$2y$")) {
            return trimmed;
        }

        return passwordEncoder.encode(trimmed);
    }
}
