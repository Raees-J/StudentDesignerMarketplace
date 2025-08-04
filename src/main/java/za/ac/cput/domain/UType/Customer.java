package za.ac.cput.domain.UType;

import za.ac.cput.domain.User;

import java.lang.module.ModuleDescriptor;

public class Customer extends User {
    private String paymentMethod;
    private double amount;

    public Customer(Builder builder) {
        this.paymentMethod = builder.paymentMethod;
        this.amount = builder.amount;

    }

    public Customer(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public double getAmount() {
        return amount;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "paymentMethod='" + paymentMethod + '\'' +
                ", amount=" + amount +
                '}';
    }

    public static class Builder {
        private String paymentMethod;
        private double amount;


    public Builder setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;

    }

    public Builder setAmount(double amount) {
        this.amount = amount;
        return this;
    }

    public Builder copy(Customer customer) {
        this.paymentMethod = customer.getPaymentMethod();
        this.amount = customer.getAmount();
        return this;
    }

    public Customer build() {
        return new Customer(this);
    }

}


}

