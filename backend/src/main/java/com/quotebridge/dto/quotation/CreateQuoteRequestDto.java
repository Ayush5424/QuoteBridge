package com.quotebridge.dto.quotation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class CreateQuoteRequestDto {
    private String supplierName;

    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "Delivery location is required")
    private String deliveryLocation;

    @NotBlank(message = "Required by date is required")
    private String requiredByDate;

    private String title;
    private String details;
    private String priority = "High Priority";

    @NotEmpty(message = "At least one product item is required")
    private List<ProductItemDto> products = new ArrayList<>();

    public CreateQuoteRequestDto() {}

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getRequiredByDate() { return requiredByDate; }
    public void setRequiredByDate(String requiredByDate) { this.requiredByDate = requiredByDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public List<ProductItemDto> getProducts() { return products; }
    public void setProducts(List<ProductItemDto> products) { this.products = products; }
}
