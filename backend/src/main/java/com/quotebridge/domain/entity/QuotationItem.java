package com.quotebridge.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "quotation_items")
public class QuotationItem {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_request_id", nullable = false)
    @JsonIgnore
    private QuotationRequest quotationRequest;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal quantity;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String specs;

    private String reference;

    public QuotationItem() {}

    public QuotationItem(String id, QuotationRequest quotationRequest, String productName, BigDecimal quantity, String unit, String specs, String reference) {
        this.id = id;
        this.quotationRequest = quotationRequest;
        this.productName = productName;
        this.quantity = quantity;
        this.unit = unit;
        this.specs = specs;
        this.reference = reference;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public QuotationRequest getQuotationRequest() { return quotationRequest; }
    public void setQuotationRequest(QuotationRequest quotationRequest) { this.quotationRequest = quotationRequest; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getSpecs() { return specs; }
    public void setSpecs(String specs) { this.specs = specs; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}
