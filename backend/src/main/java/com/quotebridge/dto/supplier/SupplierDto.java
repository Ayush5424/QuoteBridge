package com.quotebridge.dto.supplier;

public class SupplierDto {
    private String id;
    private String organizationName;
    private String supplierTier;
    private String contactName;
    private String contactRole;
    private String contactEmail;
    private String contactPhone;
    private String status;

    public SupplierDto() {}

    public SupplierDto(String id, String organizationName, String supplierTier, String contactName, String contactRole, String contactEmail, String contactPhone, String status) {
        this.id = id;
        this.organizationName = organizationName;
        this.supplierTier = supplierTier;
        this.contactName = contactName;
        this.contactRole = contactRole;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

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
