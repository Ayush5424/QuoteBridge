package com.quotebridge.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String specs;

    @Column(nullable = false, length = 50)
    private String unit = "units";

    public Product() {}

    public Product(String id, String name, String category, String specs, String unit) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.specs = specs;
        this.unit = unit;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSpecs() { return specs; }
    public void setSpecs(String specs) { this.specs = specs; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
