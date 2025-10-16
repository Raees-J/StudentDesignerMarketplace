package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.UType.Customer;
import za.ac.cput.domain.User;
import za.ac.cput.repository.CustomerRepository;
import za.ac.cput.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Locale;

@Service
public class CustomerService implements ICustomerService {

    private final CustomerRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public CustomerService(CustomerRepository repository, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    public Customer create(Customer customer) {
        if (customer == null) {
            return null;
        }

        ensureEmailIsUnique(customer.getEmail());

        Customer preparedCustomer = prepareCustomerForPersistence(customer);
        validateEmailUniqueness(preparedCustomer.getEmail(), null);
        return repository.save(preparedCustomer);
    }

    @Override
    public Customer read(UUID id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Customer update(Customer customer) {
        if (customer == null || customer.getUserId() == null) {
            return null;
        }
        if (customer == null || customer.getUserId() == null) {
            return null;
        }
        if (repository.existsById(customer.getUserId())) {
            ensureEmailBelongsToCustomer(customer);
            Customer preparedCustomer = prepareCustomerForPersistence(customer);
            validateEmailUniqueness(preparedCustomer.getEmail(), customer.getUserId());
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
    public List<Customer> findByPaymentMethod(String paymentMethod) {
        return repository.findByPaymentMethod(paymentMethod);
        }
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

private void ensureEmailIsUnique(String email) {
    if (email == null || email.isBlank()) {
        return;
    }

    String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
    if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
        throw new IllegalStateException("Email already exists");
    }
}

private void ensureEmailBelongsToCustomer(Customer customer) {
    if (customer.getEmail() == null || customer.getEmail().isBlank()) {
        return;
    }

    String normalizedEmail = customer.getEmail().trim().toLowerCase(Locale.ROOT);
    Optional<User> existing = userRepository.findByEmailIgnoreCase(normalizedEmail);
    if (existing.isPresent() && !existing.get().getUserId().equals(customer.getUserId())) {
        throw new IllegalStateException("Email already exists");
    }
}

    private void validateEmailUniqueness(String email, UUID customerId) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        Customer existingCustomer = repository.findByEmailIgnoreCase(normalizedEmail);
        if (existingCustomer != null) {
            if (customerId == null || !existingCustomer.getUserId().equals(customerId)) {
                throw new IllegalArgumentException("A customer with this email already exists");
            }
        }
    }

    private String normalizeEmail(String candidate) {
        return candidate == null ? null : candidate.trim().toLowerCase(Locale.ROOT);
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
