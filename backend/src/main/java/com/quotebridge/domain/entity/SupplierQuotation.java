package com.quotebridge.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "supplier_quotations")
public class SupplierQuotation {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_request_id", nullable = false)
    @JsonIgnore
    private QuotationRequest quotationRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false)
    private String supplierName;

    private String supplierTier;
    private String contactName;
    private String contactRole;
    private String contactEmail;
    private String contactPhone;

    @Column(nullable = false)
    private int validityDays = 15;

    @Column(columnDefinition = "TEXT")
    private String generalTerms;

    private String shippingRoute;
    private Integer estDeliveryDays;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 50)
    private String status = "Submitted";

    @Column(nullable = false, updatable = false)
    private OffsetDateTime submittedAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "supplierQuotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierQuotationItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "supplierQuotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private AlternativeProductProposal alternativeProduct;

    public SupplierQuotation() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public QuotationRequest getQuotationRequest() { return quotationRequest; }
    public void setQuotationRequest(QuotationRequest quotationRequest) { this.quotationRequest = quotationRequest; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getSupplierTier() { return supplierTier; }
    public void setSupplierTier(String supplierTier) { this.supplierTier = supplierTier; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getContactRole() { return contactRole; }
    public void setContactRole(String contactRole) { this.contactRole = contactRole; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public int getValidityDays() { return validityDays; }
    public void setValidityDays(int validityDays) { this.validityDays = validityDays; }

    public String getGeneralTerms() { return generalTerms; }
    public void setGeneralTerms(String generalTerms) { this.generalTerms = generalTerms; }

    public String getShippingRoute() { return shippingRoute; }
    public void setShippingRoute(String shippingRoute) { this.shippingRoute = shippingRoute; }

    public Integer getEstDeliveryDays() { return estDeliveryDays; }
    public void setEstDeliveryDays(Integer estDeliveryDays) { this.estDeliveryDays = estDeliveryDays; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(OffsetDateTime submittedAt) { this.submittedAt = submittedAt; }

    public List<SupplierQuotationItem> getItems() { return items; }
    public void setItems(List<SupplierQuotationItem> items) { this.items = items; }

    public AlternativeProductProposal getAlternativeProduct() { return alternativeProduct; }
    public void setAlternativeProduct(AlternativeProductProposal alternativeProduct) { this.alternativeProduct = alternativeProduct; }
}
