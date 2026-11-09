package com.quotebridge.domain.entity;

import com.quotebridge.domain.enums.OrderStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"quotation_request_id", "supplier_quotation_id"})
})
public class Order {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_request_id", nullable = false)
    private QuotationRequest quotationRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_quotation_id", nullable = false)
    private SupplierQuotation supplierQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_organization_id")
    private Organization buyerOrganization;

    @Column(nullable = false)
    private String supplierName;

    private String contactName;
    private String contactRole;
    private String contactEmail;
    private String contactPhone;

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String deliveryLocation;

    @Column(nullable = false, length = 50)
    private String confirmedDate;

    @Column(nullable = false, length = 50)
    private String expectedDelivery;

    private String shippingRoute;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private int totalUnits = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OrderStatus status = OrderStatus.Confirmed;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public QuotationRequest getQuotationRequest() { return quotationRequest; }
    public void setQuotationRequest(QuotationRequest quotationRequest) { this.quotationRequest = quotationRequest; }

    public SupplierQuotation getSupplierQuotation() { return supplierQuotation; }
    public void setSupplierQuotation(SupplierQuotation supplierQuotation) { this.supplierQuotation = supplierQuotation; }

    public Organization getBuyerOrganization() { return buyerOrganization; }
    public void setBuyerOrganization(Organization buyerOrganization) { this.buyerOrganization = buyerOrganization; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getContactRole() { return contactRole; }
    public void setContactRole(String contactRole) { this.contactRole = contactRole; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getConfirmedDate() { return confirmedDate; }
    public void setConfirmedDate(String confirmedDate) { this.confirmedDate = confirmedDate; }

    public String getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(String expectedDelivery) { this.expectedDelivery = expectedDelivery; }

    public String getShippingRoute() { return shippingRoute; }
    public void setShippingRoute(String shippingRoute) { this.shippingRoute = shippingRoute; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public int getTotalUnits() { return totalUnits; }
    public void setTotalUnits(int totalUnits) { this.totalUnits = totalUnits; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
