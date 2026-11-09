package com.quotebridge.repository;

import com.quotebridge.domain.entity.QuotationRequest;
import com.quotebridge.domain.enums.QuoteStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRequestRepository extends JpaRepository<QuotationRequest, String> {
    Optional<QuotationRequest> findByRfqNumber(String rfqNumber);

    List<QuotationRequest> findByBuyerOrganizationIdOrderByCreatedAtDesc(String buyerOrganizationId);

    List<QuotationRequest> findByStatusOrderByCreatedAtDesc(QuoteStatus status);

    @Query("SELECT q FROM QuotationRequest q WHERE " +
           "(:buyerOrgId IS NULL OR q.buyerOrganization.id = :buyerOrgId) AND " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:search IS NULL OR LOWER(q.rfqNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.businessName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<QuotationRequest> searchQuotations(@Param("buyerOrgId") String buyerOrgId,
                                            @Param("status") QuoteStatus status,
                                            @Param("search") String search,
                                            Pageable pageable);

    @Query("SELECT q FROM QuotationRequest q WHERE " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:search IS NULL OR LOWER(q.rfqNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.businessName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<QuotationRequest> searchAllQuotations(@Param("status") QuoteStatus status,
                                               @Param("search") String search,
                                               Pageable pageable);

    long countByBuyerOrganizationIdAndStatus(String buyerOrganizationId, QuoteStatus status);
    long countByStatus(QuoteStatus status);
}
