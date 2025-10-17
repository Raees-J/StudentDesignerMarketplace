package za.ac.cput.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import za.ac.cput.domain.Order;
import za.ac.cput.repository.OrderRepository;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository repository;

    @Autowired
    public OrderService(OrderRepository repository){
        this.repository = repository;
    }

    @Override
    public Order create(Order order){
        Order newOrder = new Order.Builder()
                .setOrderID(order.getOrderID())
                .setProductID(order.getProductID())
                .setCustomerID(order.getCustomerID())
                .setQuantity(order.getQuantity())
                .setTotal(order.getTotal())
                .setPaymentMethod(order.getPaymentMethod())
                .setPaymentStatus(order.getPaymentStatus())
                .build();
        return repository.save(newOrder);
    }

    @Override
    public Order read(String orderID){
        return repository.findById(orderID).orElse(null);
    }

    @Override
    public Order update(Order order){
        if(repository.existsById(order.getOrderID())){
            Order updated = new Order.Builder()
                    .setOrderID(order.getOrderID())
                    .setProductID(order.getProductID())
                    .setCustomerID(order.getCustomerID())
                    .setQuantity(order.getQuantity())
                    .setTotal(order.getTotal())
                    .setPaymentMethod(order.getPaymentMethod())
                    .setPaymentStatus(order.getPaymentStatus())
                    .build();
            return repository.save(updated);
        }
        return null;
    }

    @Override
    public void delete(String orderID){
        repository.deleteById(orderID);
    }

    @Override
    public List<Order> getAll(){
        return repository.findAll();
    }
}