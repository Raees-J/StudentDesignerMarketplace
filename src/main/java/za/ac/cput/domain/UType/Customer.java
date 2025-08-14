package za.ac.cput.domain.UType;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import za.ac.cput.domain.User;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class Customer extends User {
    private String paymentMethod;
    private double amount;

    protected Customer() {}

    public Customer(Builder builder) {
        super(builder.userName, builder.email, builder.password, builder.role);
        this.paymentMethod = builder.paymentMethod;
        this.amount = builder.amount;

    }
    public String getPaymentMethod() { return paymentMethod; }

    public double getAmount() { return amount; }

    public static class Builder {
        private String userName;
        private String email;
        private String password;
        private String role;
        private String paymentMethod;
        private double amount;

        public Builder setUserName(String userName)
        { this.userName = userName;
            return this; }

        public Builder setEmail(String email)
        { this.email = email;
            return this; }

        public Builder setPassword(String password)
        { this.password = password;
            return this; }

        public Builder setRole(String role)
        { this.role = role;
            return this; }

        public Builder setPaymentMethod(String paymentMethod)
        { this.paymentMethod = paymentMethod;
            return this; }

        public Builder setAmount(double amount)
        { this.amount = amount;
            return this; }

        public Customer build() { return new Customer(this); }
    }
}





