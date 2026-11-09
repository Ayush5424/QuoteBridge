package com.quotebridge.dto.quotation;

import com.quotebridge.domain.enums.QuoteStatus;
import java.util.ArrayList;
import java.util.List;

public class QuoteRequestDto {
    private String id;
    private String rfqNumber;
    private String title;
    private String businessName;
    private String deliveryLocation;
    private String requiredByDate;
    private String createdDate;
    private QuoteStatus status;
    private String priority;
    private String details;
    private String selectedSupplierId;
    private String selectedResponseId;
    private List<ProductItemDto> products = new ArrayList<>();
    private List<QuotationResponseDto> responses = new ArrayList<>();

    public QuoteRequestDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRfqNumber() { return rfqNumber; }
    public void setRfqNumber(String rfqNumber) { this.rfqNumber = rfqNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getRequiredByDate() { return requiredByDate; }
    public void setRequiredByDate(String requiredByDate) { this.requiredByDate = requiredByDate; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

    public QuoteStatus getStatus() { return status; }
    public void setStatus(QuoteStatus status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getSelectedSupplierId() { return selectedSupplierId; }
    public void setSelectedSupplierId(String selectedSupplierId) { this.selectedSupplierId = selectedSupplierId; }

    public String getSelectedResponseId() { return selectedResponseId; }
    public void setSelectedResponseId(String selectedResponseId) { this.selectedResponseId = selectedResponseId; }

    public List<ProductItemDto> getProducts() { return products; }
    public void setProducts(List<ProductItemDto> products) { this.products = products; }

    public List<QuotationResponseDto> getResponses() { return responses; }
    public void setResponses(List<QuotationResponseDto> responses) { this.responses = responses; }
}
