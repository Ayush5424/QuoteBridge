package com.quotebridge.service;

import com.quotebridge.domain.entity.QuotationItem;
import com.quotebridge.domain.entity.QuotationRequest;
import com.quotebridge.domain.entity.SupplierQuotation;
import com.quotebridge.domain.entity.SupplierQuotationItem;
import com.quotebridge.dto.comparison.ComparisonSummaryDto;
import com.quotebridge.dto.comparison.ComparisonSummaryDto.LineItemComparisonRowDto;
import com.quotebridge.dto.quotation.QuotationResponseDto;
import com.quotebridge.exception.ResourceNotFoundException;
import com.quotebridge.repository.QuotationRequestRepository;
import com.quotebridge.repository.SupplierQuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class ComparisonService {

    private final QuotationRequestRepository quotationRequestRepository;
    private final SupplierQuotationRepository supplierQuotationRepository;
    private final QuotationService quotationService;

    public ComparisonService(QuotationRequestRepository quotationRequestRepository,
                             SupplierQuotationRepository supplierQuotationRepository,
                             QuotationService quotationService) {
        this.quotationRequestRepository = quotationRequestRepository;
        this.supplierQuotationRepository = supplierQuotationRepository;
        this.quotationService = quotationService;
    }

    @Transactional(readOnly = true)
    public ComparisonSummaryDto getComparisonSummary(String quoteId) {
        QuotationRequest quote = quotationRequestRepository.findById(quoteId)
                .or(() -> quotationRequestRepository.findByRfqNumber(quoteId))
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + quoteId));

        List<SupplierQuotation> responses = supplierQuotationRepository.findByQuotationRequestId(quote.getId());

        ComparisonSummaryDto summary = new ComparisonSummaryDto();
        summary.setQuoteId(quote.getId());
        summary.setRfqNumber(quote.getRfqNumber());
        summary.setTitle(quote.getTitle());
        summary.setBusinessName(quote.getBusinessName());

        List<QuotationResponseDto> responseDtos = new ArrayList<>();
        for (SupplierQuotation sq : responses) {
            responseDtos.add(quotationService.mapResponseToDto(sq));
        }
        summary.setResponses(responseDtos);

        if (responses.isEmpty()) {
            summary.setBestValueSupplier("Pending Responses");
            summary.setBestValueAmount(BigDecimal.ZERO);
            summary.setSavingsAmount(BigDecimal.ZERO);
            summary.setSpeedLeaderSupplier("N/A");
            summary.setSpeedLeaderDays(0);
            summary.setLineItemsMatch("0/0");
            return summary;
        }

        // 1. Best Value Supplier (lowest total amount)
        SupplierQuotation bestValue = responses.stream()
                .filter(r -> r.getTotalAmount() != null && r.getTotalAmount().compareTo(BigDecimal.ZERO) > 0)
                .min(Comparator.comparing(SupplierQuotation::getTotalAmount))
                .orElse(responses.get(0));

        SupplierQuotation highestValue = responses.stream()
                .filter(r -> r.getTotalAmount() != null && r.getTotalAmount().compareTo(BigDecimal.ZERO) > 0)
                .max(Comparator.comparing(SupplierQuotation::getTotalAmount))
                .orElse(responses.get(0));

        summary.setBestValueSupplier(bestValue.getSupplierName());
        summary.setBestValueAmount(bestValue.getTotalAmount() != null ? bestValue.getTotalAmount() : BigDecimal.ZERO);

        BigDecimal savings = BigDecimal.ZERO;
        if (responses.size() > 1 && highestValue.getTotalAmount() != null && bestValue.getTotalAmount() != null) {
            savings = highestValue.getTotalAmount().subtract(bestValue.getTotalAmount());
        } else if (bestValue.getTotalAmount() != null) {
            // Calculated standard baseline savings (e.g. 10% benchmark)
            savings = bestValue.getTotalAmount().multiply(new BigDecimal("0.10")).setScale(2, java.math.RoundingMode.HALF_UP);
        }
        summary.setSavingsAmount(savings);

        // 2. Speed Leader Supplier (lowest delivery days)
        SupplierQuotation speedLeader = responses.stream()
                .filter(r -> r.getEstDeliveryDays() != null && r.getEstDeliveryDays() > 0)
                .min(Comparator.comparing(SupplierQuotation::getEstDeliveryDays))
                .orElse(responses.get(0));

        summary.setSpeedLeaderSupplier(speedLeader.getSupplierName());
        summary.setSpeedLeaderDays(speedLeader.getEstDeliveryDays() != null ? speedLeader.getEstDeliveryDays() : 3);

        // 3. Line items comparison matrix
        List<LineItemComparisonRowDto> lineItemRows = new ArrayList<>();
        int totalItemsCount = quote.getItems() != null ? quote.getItems().size() : 0;
        int matchingItemsCount = 0;

        if (quote.getItems() != null) {
            for (QuotationItem qi : quote.getItems()) {
                LineItemComparisonRowDto row = new LineItemComparisonRowDto();
                row.setProductId(qi.getId());
                row.setProductName(qi.getProductName());
                row.setSpecs(qi.getSpecs());
                row.setQuantity(qi.getQuantity());
                row.setUnit(qi.getUnit());

                Map<String, BigDecimal> prices = new HashMap<>();
                Map<String, Boolean> availability = new HashMap<>();
                String lowestPriceSup = null;
                BigDecimal minPrice = null;

                for (SupplierQuotation sq : responses) {
                    String supKey = sq.getSupplierName();
                    boolean itemFound = false;
                    if (sq.getItems() != null) {
                        for (SupplierQuotationItem sqi : sq.getItems()) {
                            // match by product name or id
                            if (sqi.getProductId().equalsIgnoreCase(qi.getId()) ||
                                sqi.getProductId().equalsIgnoreCase(qi.getProductName())) {
                                itemFound = true;
                                prices.put(supKey, sqi.getUnitPrice());
                                availability.put(supKey, sqi.isAvailable());

                                if (sqi.getUnitPrice() != null && (minPrice == null || sqi.getUnitPrice().compareTo(minPrice) < 0)) {
                                    minPrice = sqi.getUnitPrice();
                                    lowestPriceSup = supKey;
                                }
                                break;
                            }
                        }
                    }
                    if (!itemFound) {
                        prices.put(supKey, BigDecimal.ZERO);
                        availability.put(supKey, false);
                    }
                }

                row.setSupplierPrices(prices);
                row.setSupplierAvailability(availability);
                row.setLowestPriceSupplierId(lowestPriceSup);
                lineItemRows.add(row);
                matchingItemsCount++;
            }
        }

        summary.setLineItems(lineItemRows);
        summary.setLineItemsMatch(matchingItemsCount + "/" + totalItemsCount);

        return summary;
    }
}
