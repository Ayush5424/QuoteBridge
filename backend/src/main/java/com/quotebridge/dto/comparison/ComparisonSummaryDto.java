package com.quotebridge.dto.comparison;

import com.quotebridge.dto.quotation.QuotationResponseDto;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ComparisonSummaryDto {
    private String quoteId;
    private String rfqNumber;
    private String title;
    private String businessName;

    // USP Highlights
    private String bestValueSupplier;
    private BigDecimal bestValueAmount = BigDecimal.ZERO;
    private BigDecimal savingsAmount = BigDecimal.ZERO;
    private String speedLeaderSupplier;
    private Integer speedLeaderDays;
    private String lineItemsMatch;

    private List<QuotationResponseDto> responses = new ArrayList<>();
    private List<LineItemComparisonRowDto> lineItems = new ArrayList<>();

    public static class LineItemComparisonRowDto {
        private String productId;
        private String productName;
        private String specs;
        private BigDecimal quantity;
        private String unit;
        private Map<String, BigDecimal> supplierPrices; // supplierId -> unitPrice
        private Map<String, Boolean> supplierAvailability; // supplierId -> available
        private String lowestPriceSupplierId;

        public LineItemComparisonRowDto() {}

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getSpecs() { return specs; }
        public void setSpecs(String specs) { this.specs = specs; }

        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }

        public Map<String, BigDecimal> getSupplierPrices() { return supplierPrices; }
        public void setSupplierPrices(Map<String, BigDecimal> supplierPrices) { this.supplierPrices = supplierPrices; }

        public Map<String, Boolean> getSupplierAvailability() { return supplierAvailability; }
        public void setSupplierAvailability(Map<String, Boolean> supplierAvailability) { this.supplierAvailability = supplierAvailability; }

        public String getLowestPriceSupplierId() { return lowestPriceSupplierId; }
        public void setLowestPriceSupplierId(String lowestPriceSupplierId) { this.lowestPriceSupplierId = lowestPriceSupplierId; }
    }

    public ComparisonSummaryDto() {}

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public String getRfqNumber() { return rfqNumber; }
    public void setRfqNumber(String rfqNumber) { this.rfqNumber = rfqNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBestValueSupplier() { return bestValueSupplier; }
    public void setBestValueSupplier(String bestValueSupplier) { this.bestValueSupplier = bestValueSupplier; }

    public BigDecimal getBestValueAmount() { return bestValueAmount; }
    public void setBestValueAmount(BigDecimal bestValueAmount) { this.bestValueAmount = bestValueAmount; }

    public BigDecimal getSavingsAmount() { return savingsAmount; }
    public void setSavingsAmount(BigDecimal savingsAmount) { this.savingsAmount = savingsAmount; }

    public String getSpeedLeaderSupplier() { return speedLeaderSupplier; }
    public void setSpeedLeaderSupplier(String speedLeaderSupplier) { this.speedLeaderSupplier = speedLeaderSupplier; }

    public Integer getSpeedLeaderDays() { return speedLeaderDays; }
    public void setSpeedLeaderDays(Integer speedLeaderDays) { this.speedLeaderDays = speedLeaderDays; }

    public String getLineItemsMatch() { return lineItemsMatch; }
    public void setLineItemsMatch(String lineItemsMatch) { this.lineItemsMatch = lineItemsMatch; }

    public List<QuotationResponseDto> getResponses() { return responses; }
    public void setResponses(List<QuotationResponseDto> responses) { this.responses = responses; }

    public List<LineItemComparisonRowDto> getLineItems() { return lineItems; }
    public void setLineItems(List<LineItemComparisonRowDto> lineItems) { this.lineItems = lineItems; }
}
