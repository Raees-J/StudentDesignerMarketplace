package za.ac.cput.domain;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Order entity capturing a purchase of a product by a customer.
 */
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String orderID;
    private String productID;
    private String customerID;
    private int quantity;
    private double total;
    private String paymentMethod;
    private String paymentStatus;

    protected Order(){}

    private Order(Builder builder){
        this.orderID = builder.orderID;
        this.productID = builder.productID;
        this.customerID = builder.customerID;
        this.quantity = builder.quantity;
        this.total = builder.total;
        this.paymentMethod = builder.paymentMethod;
        this.paymentStatus = builder.paymentStatus;
    }

    public String getOrderID(){return orderID;}
    public String getProductID(){return productID;}
    public String getCustomerID(){return customerID;}
    public int getQuantity(){return quantity;}
    public double getTotal(){return total;}
    public String getPaymentMethod(){return paymentMethod;}
    public String getPaymentStatus(){return paymentStatus;}

    @Override
    public boolean equals(Object o){
        if(this==o) return true;
        if(o==null || getClass()!=o.getClass()) return false;
        Order order=(Order)o;
        return quantity==order.quantity && Double.compare(order.total,total)==0 &&
                Objects.equals(orderID, order.orderID) &&
                Objects.equals(productID, order.productID) &&
                Objects.equals(customerID, order.customerID) &&
                Objects.equals(paymentMethod, order.paymentMethod) &&
                Objects.equals(paymentStatus, order.paymentStatus);
    }

    @Override
    public int hashCode(){
        return Objects.hash(orderID, productID, customerID, quantity, total, paymentMethod, paymentStatus);
    }

    @Override
    public String toString(){
        return "Order{" +
                "orderID='" + orderID + '\'' +
                ", productID='" + productID + '\'' +
                ", customerID='" + customerID + '\'' +
                ", quantity=" + quantity +
                ", total=" + total +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                '}';
    }

    public static class Builder {
        private String orderID;
        private String productID;
        private String customerID;
        private int quantity;
        private double total;
        private String paymentMethod;
        private String paymentStatus;

        public Builder setOrderID(String orderID){this.orderID=orderID;return this;}
        public Builder setProductID(String productID){this.productID=productID;return this;}
        public Builder setCustomerID(String customerID){this.customerID=customerID;return this;}
        public Builder setQuantity(int quantity){this.quantity=quantity;return this;}
        public Builder setTotal(double total){this.total=total;return this;}
        public Builder setPaymentMethod(String paymentMethod){this.paymentMethod=paymentMethod;return this;}
        public Builder setPaymentStatus(String paymentStatus){this.paymentStatus=paymentStatus;return this;}

        public Builder copy(Order order){
            this.orderID=order.orderID;
            this.productID=order.productID;
            this.customerID=order.customerID;
            this.quantity=order.quantity;
            this.total=order.total;
            this.paymentMethod=order.paymentMethod;
            this.paymentStatus=order.paymentStatus;
            return this;
        }

        public Order build(){return new Order(this);}
    }
}