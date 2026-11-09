package com.quotebridge.domain.entity;

import com.quotebridge.domain.enums.QuoteStatus;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotation_requests")
public class QuotationRequest {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String rfqNumber;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_organization_id")
    private Organization buyerOrganization;

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String deliveryLocation;

    @Column(nullable = false, length = 50)
    private String requiredByDate;

    @Column(nullable = false, length = 50)
    private String priority = "Normal";

    @Column(columnDefinition = "TEXT")
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private QuoteStatus status = QuoteStatus.Pending;

    @Column(length = 50)
    private String selectedSupplierId;

    @Column(length = 50)
    private String selectedResponseId;

    @OneToMany(mappedBy = "quotationRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "quotationRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationSupplier> invitedSuppliers = new ArrayList<>();

    @OneToMany(mappedBy = "quotationRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierQuotation> responses = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public QuotationRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRfqNumber() { return rfqNumber; }
    public void setRfqNumber(String rfqNumber) { this.rfqNumber = rfqNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Organization getBuyerOrganization() { return buyerOrganization; }
    public void setBuyerOrganization(Organization buyerOrganization) { this.buyerOrganization = buyerOrganization; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getRequiredByDate() { return requiredByDate; }
    public void setRequiredByDate(String requiredByDate) { this.requiredByDate = requiredByDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public QuoteStatus getStatus() { return status; }
    public void setStatus(QuoteStatus status) { this.status = status; }

    public String getSelectedSupplierId() { return selectedSupplierId; }
    public void setSelectedSupplierId(String selectedSupplierId) { this.selectedSupplierId = selectedSupplierId; }

    public String getSelectedResponseId() { return selectedResponseId; }
    public void setSelectedResponseId(String selectedResponseId) { this.selectedResponseId = selectedResponseId; }

    public List<QuotationItem> getItems() { return items; }
    public void setItems(List<QuotationItem> items) { this.items = items; }

    public List<QuotationSupplier> getInvitedSuppliers() { return invitedSuppliers; }
    public void setInvitedSuppliers(List<QuotationSupplier> invitedSuppliers) { this.invitedSuppliers = invitedSuppliers; }

    public List<SupplierQuotation> getResponses() { return responses; }
    public void setResponses(List<SupplierQuotation> responses) { this.responses = responses; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
