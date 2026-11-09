package com.quotebridge.repository;

import com.quotebridge.domain.entity.SupplierQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierQuotationRepository extends JpaRepository<SupplierQuotation, String> {
    List<SupplierQuotation> findByQuotationRequestId(String quotationRequestId);
    List<SupplierQuotation> findBySupplierId(String supplierId);
    Optional<SupplierQuotation> findByQuotationRequestIdAndSupplierId(String quotationRequestId, String supplierId);
    boolean existsByQuotationRequestIdAndSupplierId(String quotationRequestId, String supplierId);
}
