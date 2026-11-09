package com.quotebridge.service;

import com.quotebridge.domain.entity.QuotationItem;
import com.quotebridge.domain.entity.QuotationRequest;
import com.quotebridge.domain.entity.SupplierQuotation;
import com.quotebridge.domain.entity.SupplierQuotationItem;
import com.quotebridge.dto.comparison.ComparisonSummaryDto;
import com.quotebridge.dto.quotation.QuotationResponseDto;
import com.quotebridge.repository.QuotationRequestRepository;
import com.quotebridge.repository.SupplierQuotationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ComparisonServiceTest {

    @Mock
    private QuotationRequestRepository quotationRequestRepository;
    @Mock
    private SupplierQuotationRepository supplierQuotationRepository;
    @Mock
    private QuotationService quotationService;

    @InjectMocks
    private ComparisonService comparisonService;

    private QuotationRequest quote;
    private SupplierQuotation response1;
    private SupplierQuotation response2;

    @BeforeEach
    void setUp() {
        quote = new QuotationRequest();
        quote.setId("quote-1");
        quote.setRfqNumber("#RQ-2024-001");
        quote.setTitle("Raw Materials Procurement");
        quote.setBusinessName("Fresh Market Co.");

        QuotationItem item1 = new QuotationItem("qi-1", quote, "Steel Bolts", new BigDecimal("100"), "pcs", "M8 x 50mm", "SKU-BOLT-01");
        quote.setItems(List.of(item1));

        response1 = new SupplierQuotation();
        response1.setId("resp-1");
        response1.setQuotationRequest(quote);
        response1.setSupplierName("Apex Industrial");
        response1.setTotalAmount(new BigDecimal("12000.00"));
        response1.setEstDeliveryDays(5);

        SupplierQuotationItem sqi1 = new SupplierQuotationItem("sqi-1", response1, "qi-1", true, new BigDecimal("120.00"), "Nov 15", "In stock");
        response1.setItems(List.of(sqi1));

        response2 = new SupplierQuotation();
        response2.setId("resp-2");
        response2.setQuotationRequest(quote);
        response2.setSupplierName("Nexus Global");
        response2.setTotalAmount(new BigDecimal("10500.00"));
        response2.setEstDeliveryDays(3);

        SupplierQuotationItem sqi2 = new SupplierQuotationItem("sqi-2", response2, "qi-1", true, new BigDecimal("105.00"), "Nov 12", "Fast shipping");
        response2.setItems(List.of(sqi2));
    }

    @Test
    void testGetComparisonSummary_CalculatesBestValueAndSpeedLeader() {
        when(quotationRequestRepository.findById("quote-1")).thenReturn(Optional.of(quote));
        when(supplierQuotationRepository.findByQuotationRequestId("quote-1")).thenReturn(List.of(response1, response2));
        when(quotationService.mapResponseToDto(any())).thenReturn(new QuotationResponseDto());

        ComparisonSummaryDto summary = comparisonService.getComparisonSummary("quote-1");

        assertNotNull(summary);
        assertEquals("quote-1", summary.getQuoteId());
        assertEquals("Nexus Global", summary.getBestValueSupplier());
        assertEquals(new BigDecimal("10500.00"), summary.getBestValueAmount());
        assertEquals(new BigDecimal("1500.00"), summary.getSavingsAmount()); // 12000 - 10500
        assertEquals("Nexus Global", summary.getSpeedLeaderSupplier());
        assertEquals(3, summary.getSpeedLeaderDays());
        assertEquals("1/1", summary.getLineItemsMatch());
    }
}
