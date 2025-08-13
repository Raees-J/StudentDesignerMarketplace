package za.ac.cput.service;

import za.ac.cput.domain.UType.Customer;

import java.util.List;

public interface ICustomerService extends IService <Customer, String> {
    List<Customer> findCustomersByPaymentMethod(String paymentMethod);
    List<Customer> getAll();
}
