package com.quotebridge.dto.quotation;

import java.math.BigDecimal;

public class ProductItemDto {
    private String id;
    private String name;
    private BigDecimal quantity;
    private String unit;
    private String specs;
    private String reference;

    public ProductItemDto() {}

    public ProductItemDto(String id, String name, BigDecimal quantity, String unit, String specs, String reference) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.specs = specs;
        this.reference = reference;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getSpecs() { return specs; }
    public void setSpecs(String specs) { this.specs = specs; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}
