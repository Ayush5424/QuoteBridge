package com.quotebridge.domain.entity;

import com.quotebridge.domain.enums.OrgType;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OrgType type;

    private String contactEmail;
    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Organization() {}

    public Organization(String id, String name, OrgType type, String contactEmail, String contactPhone, String address) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.address = address;
        this.status = "ACTIVE";
        this.createdAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public OrgType getType() { return type; }
    public void setType(OrgType type) { this.type = type; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
