package za.ac.cput.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import za.ac.cput.domain.Order;
import za.ac.cput.factory.OrderFactory;
import za.ac.cput.repository.OrderRepository;
import za.ac.cput.service.OrderService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository){
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> create(@RequestBody @Valid Order orderInput){
        // Default to Card if no payment method specified
        String paymentMethod = orderInput.getPaymentMethod() != null ? orderInput.getPaymentMethod() : "Card";
        
        Order newOrder = OrderFactory.buildOrder(
                orderInput.getProductID(),
                orderInput.getCustomerID(),
                orderInput.getQuantity(),
                orderInput.getTotal(),
                paymentMethod
        );
        if(newOrder == null){
            return ResponseEntity.badRequest().body("Invalid input fields or payment method");
        }
        Order saved = orderService.create(newOrder);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/read/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Order> read(@PathVariable @NotBlank String id){
        Order order = orderService.read(id);
        if(order == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @PostMapping("/update")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Order> update(@RequestBody @Valid Order order){
        Order updated = orderService.update(order);
        if(updated == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable @NotBlank String id){
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAll(){
        return orderService.getAll();
    }

    @PostMapping("/updatePaymentStatus/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable @NotBlank String orderId, @RequestBody @NotBlank String paymentStatus) {
        try {
            Order order = orderService.read(orderId);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            
            Order updatedOrder = new Order.Builder()
                    .copy(order)
                    .setPaymentStatus(paymentStatus)
                    .build();
                    
            Order saved = orderService.update(updatedOrder);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid payment status");
        }
    }

    @GetMapping("/ping")
    public String ping(){
        return "Order backend is running!";
    }
}