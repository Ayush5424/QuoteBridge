package com.quotebridge.dto.order;

import java.math.BigDecimal;

public class OrderItemDto {
    private String description;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal confirmedPrice;

    public OrderItemDto() {}

    public OrderItemDto(String description, BigDecimal quantity, BigDecimal unitPrice, BigDecimal confirmedPrice) {
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.confirmedPrice = confirmedPrice;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getConfirmedPrice() { return confirmedPrice; }
    public void setConfirmedPrice(BigDecimal confirmedPrice) { this.confirmedPrice = confirmedPrice; }
}
