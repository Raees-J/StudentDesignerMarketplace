package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.UType.Customer;
import za.ac.cput.repository.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService implements ICustomerService {

    private final CustomerRepository repository;

    @Autowired
    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Customer create(Customer customer) {
        return repository.save(customer);
    }

    @Override
    public Customer read(String id) {
        Optional<Customer> optionalCustomer = repository.findById(id);
        return optionalCustomer.orElse(null);
}

    @Override
    public Customer update(Customer customer) {
        if (repository.existsById(customer.getPaymentMethod())) {
            return repository.save(customer);
        }
        return null;
    }

    @Override
    public boolean delete(String id) {
        if (repository.existsById(id)) {
        repository.deleteById(id);
        return true;
        }
        return false;
    }
    @Override
    public List<Customer> getAll() {
        return repository.findAll();
    }
    @Override
    public List<Customer> findCustomersByPaymentMethod(String paymentMethod) {
    // This method would require a custom query in the CustomerRepository
    // For now, we'll just return all customers and filter in memory (not efficient for large datasets)
    // In a real application, you'd add a method like:
    // List<Customer> findByPaymentMethod(String paymentMethod); to CustomerRepository
    return repository.findAll().stream()
            .filter(customer -> customer.getPaymentMethod().equalsIgnoreCase(paymentMethod))
            .toList();
    }
}
