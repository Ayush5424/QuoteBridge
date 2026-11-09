package com.quotebridge.repository;

import com.quotebridge.domain.entity.Order;
import com.quotebridge.domain.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByQuotationRequestId(String quotationRequestId);
    Optional<Order> findByQuotationRequestIdAndSupplierQuotationId(String quotationRequestId, String supplierQuotationId);
    boolean existsByQuotationRequestIdAndSupplierQuotationId(String quotationRequestId, String supplierQuotationId);
    List<Order> findByBuyerOrganizationIdOrderByCreatedAtDesc(String buyerOrganizationId);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}
