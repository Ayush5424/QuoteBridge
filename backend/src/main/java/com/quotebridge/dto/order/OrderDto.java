package com.quotebridge.dto.order;

import com.quotebridge.domain.enums.OrderStatus;
import com.quotebridge.dto.quotation.QuotationResponseDto.SupplierContactDto;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {
    private String id;
    private String orderNumber;
    private String quoteId;
    private String rfqNumber;
    private String responseId;
    private String supplierName;
    private SupplierContactDto supplierContact;
    private String businessName;
    private String deliveryLocation;
    private String confirmedDate;
    private String expectedDelivery;
    private String shippingRoute;
    private BigDecimal totalCost = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private int totalUnits;
    private OrderStatus status;
    private List<OrderItemDto> items = new ArrayList<>();

    public OrderDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public String getRfqNumber() { return rfqNumber; }
    public void setRfqNumber(String rfqNumber) { this.rfqNumber = rfqNumber; }

    public String getResponseId() { return responseId; }
    public void setResponseId(String responseId) { this.responseId = responseId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public SupplierContactDto getSupplierContact() { return supplierContact; }
    public void setSupplierContact(SupplierContactDto supplierContact) { this.supplierContact = supplierContact; }

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

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }
}
