package za.ac.cput.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.UType.Customer;
import za.ac.cput.service.CustomerService;
import java.util.List;
@RestController
@RequestMapping("/customer")
public class CustomerController {
    private final CustomerService customerService;
    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    @PostMapping("/create")
    public ResponseEntity<Customer> create(@RequestBody Customer customer) {
        Customer createdCustomer = customerService.create(customer);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }
    @GetMapping("/read/{id}")
    public ResponseEntity<Customer> read(@PathVariable String id) {
        Customer customer = customerService.read(id);
        if (customer != null) {
            return new ResponseEntity<>(customer, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PutMapping("/update")
    public ResponseEntity<Customer> update(@RequestBody Customer customer) {
        Customer updatedCustomer = customerService.update(customer);
        if (updatedCustomer != null) {
            return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = customerService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/getAll")
    public ResponseEntity<List<Customer>> getAll() {
        List<Customer> customers = customerService.getAll();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    @GetMapping("/findByPaymentMethod")
    public ResponseEntity<List<Customer>> findByPaymentMethod(@RequestParam String paymentMethod) {
        List<Customer> customers = customerService.findCustomersByPaymentMethod(paymentMethod);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
}