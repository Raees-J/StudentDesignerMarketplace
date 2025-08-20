package za.ac.cput.service;

import za.ac.cput.domain.UType.Customer;

import java.util.List;
import java.util.UUID;

public interface ICustomerService extends IService <Customer, UUID> {
    List<Customer> findByPaymentMethod(String paymentMethod);
    List<Customer> getAll();
    Customer login(String email, String password);
}
