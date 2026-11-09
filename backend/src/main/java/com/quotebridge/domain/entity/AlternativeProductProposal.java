package com.quotebridge.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "alternative_product_proposals")
public class AlternativeProductProposal {

    @Id
    @Column(length = 50)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_quotation_id", nullable = false)
    @JsonIgnore
    private SupplierQuotation supplierQuotation;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal proposedPrice = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String reason;

    public AlternativeProductProposal() {}

    public AlternativeProductProposal(String id, SupplierQuotation supplierQuotation, String name, BigDecimal proposedPrice, String reason) {
        this.id = id;
        this.supplierQuotation = supplierQuotation;
        this.name = name;
        this.proposedPrice = proposedPrice;
        this.reason = reason;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public SupplierQuotation getSupplierQuotation() { return supplierQuotation; }
    public void setSupplierQuotation(SupplierQuotation supplierQuotation) { this.supplierQuotation = supplierQuotation; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getProposedPrice() { return proposedPrice; }
    public void setProposedPrice(BigDecimal proposedPrice) { this.proposedPrice = proposedPrice; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
