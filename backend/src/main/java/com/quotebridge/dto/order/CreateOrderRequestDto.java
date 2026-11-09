package com.quotebridge.dto.order;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CreateOrderRequestDto {
    @NotBlank(message = "Quote ID is required")
    private String quoteId;

    @NotBlank(message = "Response ID is required")
    private String responseId;

    private String supplierName;
    private String businessName;
    private String deliveryLocation;
    private String expectedDelivery;
    private String shippingRoute;
    private BigDecimal totalCost;
    private BigDecimal taxAmount;
    private Integer totalUnits;
    private List<OrderItemDto> items = new ArrayList<>();

    public CreateOrderRequestDto() {}

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public String getResponseId() { return responseId; }
    public void setResponseId(String responseId) { this.responseId = responseId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(String expectedDelivery) { this.expectedDelivery = expectedDelivery; }

    public String getShippingRoute() { return shippingRoute; }
    public void setShippingRoute(String shippingRoute) { this.shippingRoute = shippingRoute; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }
}
