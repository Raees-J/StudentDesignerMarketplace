package za.ac.cput.service;

import java.util.List;
import java.util.UUID;

import za.ac.cput.domain.UType.Customer;

public interface ICustomerService extends IService <Customer, UUID> {
    List<Customer> findByPaymentMethod(String paymentMethod);
    List<Customer> getAll();
    Customer login(String email, String password);
    Customer findByEmail(String email);
}
