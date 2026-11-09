package com.quotebridge.service;

import com.quotebridge.domain.entity.*;
import com.quotebridge.domain.enums.QuoteStatus;
import com.quotebridge.dto.quotation.AlternativeProductDto;
import com.quotebridge.dto.quotation.QuotationResponseDto;
import com.quotebridge.dto.quotation.SupplierOfferItemDto;
import com.quotebridge.exception.BadRequestException;
import com.quotebridge.exception.ResourceNotFoundException;
import com.quotebridge.repository.QuotationRequestRepository;
import com.quotebridge.repository.SupplierQuotationRepository;
import com.quotebridge.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupplierQuotationService {

    private final SupplierQuotationRepository supplierQuotationRepository;
    private final QuotationRequestRepository quotationRequestRepository;
    private final SupplierRepository supplierRepository;
    private final QuotationService quotationService;

    public SupplierQuotationService(SupplierQuotationRepository supplierQuotationRepository,
                                    QuotationRequestRepository quotationRequestRepository,
                                    SupplierRepository supplierRepository,
                                    QuotationService quotationService) {
        this.supplierQuotationRepository = supplierQuotationRepository;
        this.quotationRequestRepository = quotationRequestRepository;
        this.supplierRepository = supplierRepository;
        this.quotationService = quotationService;
    }

    @Transactional
    public QuotationResponseDto submitQuotationResponse(String quoteId, QuotationResponseDto dto, User currentUser) {
        QuotationRequest quote = quotationRequestRepository.findById(quoteId)
                .or(() -> quotationRequestRepository.findByRfqNumber(quoteId))
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + quoteId));

        if (quote.getStatus() == QuoteStatus.Accepted || quote.getStatus() == QuoteStatus.Rejected) {
            throw new BadRequestException("Cannot submit response for quotation with status: " + quote.getStatus());
        }

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId()).orElse(null);
        }
        if (supplier == null && dto.getSupplierName() != null) {
            supplier = supplierRepository.findByContactName(dto.getSupplierName())
                    .orElseGet(() -> supplierRepository.findAll().stream().findFirst().orElse(null));
        }

        String responseId = "resp-" + UUID.randomUUID().toString().substring(0, 8);
        SupplierQuotation response = new SupplierQuotation();
        response.setId(responseId);
        response.setQuotationRequest(quote);
        response.setSupplier(supplier);
        response.setSupplierName(dto.getSupplierName() != null ? dto.getSupplierName() : "Nexus Global Supply");
        response.setSupplierTier(dto.getSupplierTier() != null ? dto.getSupplierTier() : "Tier 1 Supplier");

        if (dto.getSupplierContact() != null) {
            response.setContactName(dto.getSupplierContact().getName());
            response.setContactRole(dto.getSupplierContact().getRole());
            response.setContactEmail(dto.getSupplierContact().getEmail());
            response.setContactPhone(dto.getSupplierContact().getPhone());
        } else {
            response.setContactName("Sarah Jenkins");
            response.setContactRole("Senior Account Manager");
            response.setContactEmail("s.jenkins@nexusglobal.com");
            response.setContactPhone("+1 (555) 902-1144");
        }

        response.setValidityDays(dto.getValidityDays() > 0 ? dto.getValidityDays() : 15);
        response.setGeneralTerms(dto.getGeneralTerms() != null ? dto.getGeneralTerms() : "Standard 30-day payment term upon delivery and verification. Prices inclusive of standard transit insurance.");
        response.setShippingRoute(dto.getShippingRoute() != null ? dto.getShippingRoute() : "Express Air Freight");
        response.setEstDeliveryDays(dto.getEstDeliveryDays() != null ? dto.getEstDeliveryDays() : 3);
        response.setStatus(dto.getStatus() != null ? dto.getStatus() : "SUBMITTED");

        // Calculate total amount from items
        BigDecimal total = BigDecimal.ZERO;
        List<SupplierQuotationItem> items = new ArrayList<>();
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (SupplierOfferItemDto itemDto : dto.getItems()) {
                String itemId = "sqi-" + UUID.randomUUID().toString().substring(0, 8);
                BigDecimal unitPrice = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.ZERO;
                
                // Find matching quote product item to calculate subtotal if available
                BigDecimal quantity = BigDecimal.ONE;
                if (quote.getItems() != null) {
                    quantity = quote.getItems().stream()
                            .filter(qi -> qi.getId().equals(itemDto.getProductId()) || qi.getProductName().equalsIgnoreCase(itemDto.getProductId()))
                            .map(QuotationItem::getQuantity)
                            .findFirst().orElse(BigDecimal.ONE);
                }

                total = total.add(unitPrice.multiply(quantity));

                SupplierQuotationItem sqItem = new SupplierQuotationItem(
                        itemId,
                        response,
                        itemDto.getProductId(),
                        itemDto.isAvailable(),
                        unitPrice,
                        itemDto.getEstDeliveryDate() != null ? itemDto.getEstDeliveryDate() : "Nov 12, 2023",
                        itemDto.getNotes()
                );
                items.add(sqItem);
            }
        }

        response.setTotalAmount(dto.getTotalAmount() != null && dto.getTotalAmount().compareTo(BigDecimal.ZERO) > 0 ? dto.getTotalAmount() : total);
        response.setItems(items);

        if (dto.getAlternativeProduct() != null && dto.getAlternativeProduct().getName() != null && !dto.getAlternativeProduct().getName().isBlank()) {
            AlternativeProductDto altDto = dto.getAlternativeProduct();
            AlternativeProductProposal proposal = new AlternativeProductProposal(
                    "alt-" + UUID.randomUUID().toString().substring(0, 8),
                    response,
                    altDto.getName(),
                    altDto.getProposedPrice() != null ? altDto.getProposedPrice() : BigDecimal.ZERO,
                    altDto.getReason()
            );
            response.setAlternativeProduct(proposal);
        }

        SupplierQuotation saved = supplierQuotationRepository.save(response);

        // Update QuoteRequest status to Received if currently Pending
        if (quote.getStatus() == QuoteStatus.Pending) {
            quote.setStatus(QuoteStatus.Received);
            quote.setUpdatedAt(OffsetDateTime.now());
            quotationRequestRepository.save(quote);
        }

        return quotationService.mapResponseToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<QuotationResponseDto> getResponsesForQuotation(String quoteId) {
        QuotationRequest quote = quotationRequestRepository.findById(quoteId)
                .or(() -> quotationRequestRepository.findByRfqNumber(quoteId))
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + quoteId));

        return supplierQuotationRepository.findByQuotationRequestId(quote.getId()).stream()
                .map(quotationService::mapResponseToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuotationResponseDto getResponseById(String responseId) {
        SupplierQuotation resp = supplierQuotationRepository.findById(responseId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier quotation response not found: " + responseId));
        return quotationService.mapResponseToDto(resp);
    }
}
