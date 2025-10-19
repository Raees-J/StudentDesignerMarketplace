package za.ac.cput.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import za.ac.cput.domain.UType.Customer;
import za.ac.cput.repository.CustomerRepository;

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
    public Customer read(UUID id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Customer update(Customer customer) {
        if (repository.existsById(customer.getUserId())) {
            return repository.save(customer);
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
        return repository.findByEmailAndPassword(email, password);
    }

    @Override
    public Customer findByEmail(String email) {
        return repository.findByEmail(email);
    }
}
