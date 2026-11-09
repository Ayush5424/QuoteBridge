package com.quotebridge.dto.quotation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class QuotationResponseDto {
    private String id;
    private String quoteId;
    private String supplierId;
    private String supplierName;
    private String supplierTier;
    private SupplierContactDto supplierContact;
    private String submittedDate;
    private int validityDays = 15;
    private String generalTerms;
    private String shippingRoute;
    private Integer estDeliveryDays;
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private String status = "Submitted";
    private List<SupplierOfferItemDto> items = new ArrayList<>();
    private AlternativeProductDto alternativeProduct;

    public static class SupplierContactDto {
        private String name;
        private String role;
        private String email;
        private String phone;

        public SupplierContactDto() {}
        public SupplierContactDto(String name, String role, String email, String phone) {
            this.name = name;
            this.role = role;
            this.email = email;
            this.phone = phone;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public QuotationResponseDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuoteId() { return quoteId; }
    public void setQuoteId(String quoteId) { this.quoteId = quoteId; }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getSupplierTier() { return supplierTier; }
    public void setSupplierTier(String supplierTier) { this.supplierTier = supplierTier; }

    public SupplierContactDto getSupplierContact() { return supplierContact; }
    public void setSupplierContact(SupplierContactDto supplierContact) { this.supplierContact = supplierContact; }

    public String getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(String submittedDate) { this.submittedDate = submittedDate; }

    public int getValidityDays() { return validityDays; }
    public void setValidityDays(int validityDays) { this.validityDays = validityDays; }

    public String getGeneralTerms() { return generalTerms; }
    public void setGeneralTerms(String generalTerms) { this.generalTerms = generalTerms; }

    public String getShippingRoute() { return shippingRoute; }
    public void setShippingRoute(String shippingRoute) { this.shippingRoute = shippingRoute; }

    public Integer getEstDeliveryDays() { return estDeliveryDays; }
    public void setEstDeliveryDays(Integer estDeliveryDays) { this.estDeliveryDays = estDeliveryDays; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<SupplierOfferItemDto> getItems() { return items; }
    public void setItems(List<SupplierOfferItemDto> items) { this.items = items; }

    public AlternativeProductDto getAlternativeProduct() { return alternativeProduct; }
    public void setAlternativeProduct(AlternativeProductDto alternativeProduct) { this.alternativeProduct = alternativeProduct; }
}
