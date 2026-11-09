package com.quotebridge.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "supplier_quotation_items")
public class SupplierQuotationItem {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_quotation_id", nullable = false)
    @JsonIgnore
    private SupplierQuotation supplierQuotation;

    @Column(name = "product_id")
    private String productId;

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    private String estDeliveryDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public SupplierQuotationItem() {}

    public SupplierQuotationItem(String id, SupplierQuotation supplierQuotation, String productId, boolean available, BigDecimal unitPrice, String estDeliveryDate, String notes) {
        this.id = id;
        this.supplierQuotation = supplierQuotation;
        this.productId = productId;
        this.available = available;
        this.unitPrice = unitPrice;
        this.estDeliveryDate = estDeliveryDate;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public SupplierQuotation getSupplierQuotation() { return supplierQuotation; }
    public void setSupplierQuotation(SupplierQuotation supplierQuotation) { this.supplierQuotation = supplierQuotation; }

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
