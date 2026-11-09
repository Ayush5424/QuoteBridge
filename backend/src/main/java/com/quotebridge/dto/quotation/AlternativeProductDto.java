package com.quotebridge.dto.quotation;

import java.math.BigDecimal;

public class AlternativeProductDto {
    private String name;
    private BigDecimal proposedPrice = BigDecimal.ZERO;
    private String reason;

    public AlternativeProductDto() {}

    public AlternativeProductDto(String name, BigDecimal proposedPrice, String reason) {
        this.name = name;
        this.proposedPrice = proposedPrice;
        this.reason = reason;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getProposedPrice() { return proposedPrice; }
    public void setProposedPrice(BigDecimal proposedPrice) { this.proposedPrice = proposedPrice; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
