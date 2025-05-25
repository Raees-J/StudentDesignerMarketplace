package za.ac.cput.domain.UType;

import za.ac.cput.domain.User;

import java.lang.module.ModuleDescriptor;

public class Customer extends User {
    private String paymentMethod;

    public Customer(Builder builder) {

    }

    public Customer(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "paymentMethod='" + paymentMethod + '\'' +
                '}';
    }

    public static class Builder {
        private String paymentMethod;


    public Builder setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;

    }

    public Builder copy(Customer customer) {
        this.paymentMethod = customer.getPaymentMethod();
        return this;
    }

    public Customer build() {
        return new Customer(this);
    }

}


}

