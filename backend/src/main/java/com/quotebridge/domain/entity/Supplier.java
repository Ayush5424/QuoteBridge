package com.quotebridge.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    private String supplierTier;
    private String contactName;
    private String contactRole;
    private String contactEmail;
    private String contactPhone;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    public Supplier() {}

    public Supplier(String id, Organization organization, String supplierTier, String contactName, String contactRole, String contactEmail, String contactPhone) {
        this.id = id;
        this.organization = organization;
        this.supplierTier = supplierTier;
        this.contactName = contactName;
        this.contactRole = contactRole;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.status = "ACTIVE";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getSupplierTier() { return supplierTier; }
    public void setSupplierTier(String supplierTier) { this.supplierTier = supplierTier; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getContactRole() { return contactRole; }
    public void setContactRole(String contactRole) { this.contactRole = contactRole; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
