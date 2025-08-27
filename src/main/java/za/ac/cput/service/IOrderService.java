package za.ac.cput.service;

import za.ac.cput.domain.Order;

import java.util.List;

public interface IOrderService {
    Order create(Order order);
    Order read(String orderID);
    Order update(Order order);
    void delete(String orderID);
    List<Order> getAll();
}