package za.ac.cput.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Order;
import za.ac.cput.factory.OrderFactory;
import za.ac.cput.repository.OrderRepository;
import za.ac.cput.service.OrderService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository){
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Order orderInput){
        Order newOrder = OrderFactory.buildOrder(
                orderInput.getProductID(),
                orderInput.getCustomerID(),
                orderInput.getQuantity(),
                orderInput.getTotal()
        );
        if(newOrder == null){
            return ResponseEntity.badRequest().body("Invalid input fields");
        }
        Order saved = orderService.create(newOrder);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Order> read(@PathVariable String id){
        Order order = orderService.read(id);
        if(order == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @PostMapping("/update")
    public ResponseEntity<Order> update(@RequestBody Order order){
        Order updated = orderService.update(order);
        if(updated == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id){
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public List<Order> getAll(){
        return orderService.getAll();
    }

    @GetMapping("/ping")
    public String ping(){
        return "Order backend is running!";
    }
}