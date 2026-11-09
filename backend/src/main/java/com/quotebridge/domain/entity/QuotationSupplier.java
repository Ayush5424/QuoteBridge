package com.quotebridge.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "quotation_suppliers")
public class QuotationSupplier {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_request_id", nullable = false)
    @JsonIgnore
    private QuotationRequest quotationRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime invitedAt = OffsetDateTime.now();

    @Column(nullable = false, length = 50)
    private String status = "INVITED";

    public QuotationSupplier() {}

    public QuotationSupplier(String id, QuotationRequest quotationRequest, Supplier supplier) {
        this.id = id;
        this.quotationRequest = quotationRequest;
        this.supplier = supplier;
        this.invitedAt = OffsetDateTime.now();
        this.status = "INVITED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public QuotationRequest getQuotationRequest() { return quotationRequest; }
    public void setQuotationRequest(QuotationRequest quotationRequest) { this.quotationRequest = quotationRequest; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public OffsetDateTime getInvitedAt() { return invitedAt; }
    public void setInvitedAt(OffsetDateTime invitedAt) { this.invitedAt = invitedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
