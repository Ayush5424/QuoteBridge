package com.quotebridge.dto.quotation;

import java.math.BigDecimal;

public class SupplierOfferItemDto {
    private String productId;
    private boolean available = true;
    private BigDecimal unitPrice = BigDecimal.ZERO;
    private String estDeliveryDate;
    private String notes;

    public SupplierOfferItemDto() {}

    public SupplierOfferItemDto(String productId, boolean available, BigDecimal unitPrice, String estDeliveryDate, String notes) {
        this.productId = productId;
        this.available = available;
        this.unitPrice = unitPrice;
        this.estDeliveryDate = estDeliveryDate;
        this.notes = notes;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getEstDeliveryDate() { return estDeliveryDate; }
    public void setEstDeliveryDate(String estDeliveryDate) { this.estDeliveryDate = estDeliveryDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
