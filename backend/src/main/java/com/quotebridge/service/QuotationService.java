package com.quotebridge.service;

import com.quotebridge.domain.entity.*;
import com.quotebridge.domain.enums.QuoteStatus;
import com.quotebridge.dto.quotation.*;
import com.quotebridge.dto.quotation.QuotationResponseDto.SupplierContactDto;
import com.quotebridge.exception.BadRequestException;
import com.quotebridge.exception.ResourceNotFoundException;
import com.quotebridge.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuotationService {

    private final QuotationRequestRepository quotationRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMembershipRepository membershipRepository;
    private final SupplierRepository supplierRepository;
    private final SupplierQuotationRepository supplierQuotationRepository;

    public QuotationService(QuotationRequestRepository quotationRepository,
                            OrganizationRepository organizationRepository,
                            OrganizationMembershipRepository membershipRepository,
                            SupplierRepository supplierRepository,
                            SupplierQuotationRepository supplierQuotationRepository) {
        this.quotationRepository = quotationRepository;
        this.organizationRepository = organizationRepository;
        this.membershipRepository = membershipRepository;
        this.supplierRepository = supplierRepository;
        this.supplierQuotationRepository = supplierQuotationRepository;
    }

    @Transactional
    public QuoteRequestDto createQuotation(CreateQuoteRequestDto dto, User currentUser) {
        if (dto.getProducts() == null || dto.getProducts().isEmpty()) {
            throw new BadRequestException("At least one product line item is required");
        }

        // Determine buyer organization
        Organization buyerOrg = null;
        if (currentUser != null) {
            List<OrganizationMembership> memberships = membershipRepository.findByUserId(currentUser.getId());
            if (!memberships.isEmpty()) {
                buyerOrg = memberships.get(0).getOrganization();
            }
        }
        if (buyerOrg == null) {
            buyerOrg = organizationRepository.findById("org-freshmarket")
                    .orElseGet(() -> organizationRepository.findAll().stream().findFirst().orElse(null));
        }

        String quoteId = "quote-" + UUID.randomUUID().toString().substring(0, 8);
        int randomSuffix = 1000 + new Random().nextInt(9000);
        String rfqNumber = "#RQ-2024-" + randomSuffix;

        QuotationRequest quote = new QuotationRequest();
        quote.setId(quoteId);
        quote.setRfqNumber(rfqNumber);
        quote.setTitle(dto.getTitle() != null && !dto.getTitle().isBlank() ? dto.getTitle().trim() : (dto.getBusinessName() + " Quotation Request"));
        quote.setBuyerOrganization(buyerOrg);
        quote.setBusinessName(dto.getBusinessName().trim());
        quote.setDeliveryLocation(dto.getDeliveryLocation().trim());
        quote.setRequiredByDate(dto.getRequiredByDate());
        quote.setPriority(dto.getPriority() != null ? dto.getPriority() : "High Priority");
        quote.setDetails(dto.getDetails() != null ? dto.getDetails() : ("Quotation request for " + dto.getProducts().size() + " items issued by " + dto.getBusinessName()));
        quote.setStatus(QuoteStatus.Pending);

        // Add items
        List<QuotationItem> items = new ArrayList<>();
        for (ProductItemDto pDto : dto.getProducts()) {
            if (pDto.getName() != null && !pDto.getName().isBlank()) {
                String itemId = "qi-" + UUID.randomUUID().toString().substring(0, 8);
                QuotationItem item = new QuotationItem(
                        itemId,
                        quote,
                        pDto.getName().trim(),
                        pDto.getQuantity() != null ? pDto.getQuantity() : BigDecimal.ONE,
                        pDto.getUnit() != null ? pDto.getUnit() : "units",
                        pDto.getSpecs(),
                        pDto.getReference() != null ? pDto.getReference() : ("SKU-" + itemId.substring(3).toUpperCase())
                );
                items.add(item);
            }
        }
        quote.setItems(items);

        // Invite default suppliers if specified
        if (dto.getSupplierName() != null && !dto.getSupplierName().isBlank()) {
            supplierRepository.findAll().stream()
                    .filter(s -> s.getContactName().equalsIgnoreCase(dto.getSupplierName().trim()) ||
                                 (s.getOrganization() != null && s.getOrganization().getName().equalsIgnoreCase(dto.getSupplierName().trim())))
                    .findFirst()
                    .ifPresent(supplier -> {
                        QuotationSupplier qs = new QuotationSupplier("qs-" + UUID.randomUUID().toString().substring(0, 8), quote, supplier);
                        quote.getInvitedSuppliers().add(qs);
                    });
        }

        QuotationRequest saved = quotationRepository.save(quote);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<QuoteRequestDto> getQuotations(QuoteStatus status, String search, Pageable pageable) {
        Page<QuotationRequest> page;
        if (search != null && !search.isBlank()) {
            page = quotationRepository.searchAllQuotations(status, search.trim(), pageable);
        } else if (status != null) {
            page = quotationRepository.searchAllQuotations(status, null, pageable);
        } else {
            page = quotationRepository.findAll(pageable);
        }
        return page.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public List<QuoteRequestDto> getAllQuotationsList() {
        return quotationRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuoteRequestDto getQuotationById(String idOrRfq) {
        QuotationRequest quote = quotationRepository.findById(idOrRfq)
                .or(() -> quotationRepository.findByRfqNumber(idOrRfq))
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with identifier: " + idOrRfq));
        return mapToDto(quote);
    }

    @Transactional
    public QuoteRequestDto selectSupplierResponse(String quoteId, String responseId) {
        QuotationRequest quote = quotationRepository.findById(quoteId)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + quoteId));

        SupplierQuotation response = supplierQuotationRepository.findById(responseId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier quotation response not found: " + responseId));

        if (!response.getQuotationRequest().getId().equals(quote.getId())) {
            throw new BadRequestException("The specified supplier response does not belong to this quotation request");
        }

        quote.setSelectedSupplierId(response.getSupplier() != null ? response.getSupplier().getId() : null);
        quote.setSelectedResponseId(response.getId());
        quote.setStatus(QuoteStatus.Received);
        quote.setUpdatedAt(OffsetDateTime.now());

        QuotationRequest saved = quotationRepository.save(quote);
        return mapToDto(saved);
    }

    @Transactional
    public QuoteRequestDto updateQuotationStatus(String quoteId, QuoteStatus status) {
        QuotationRequest quote = quotationRepository.findById(quoteId)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + quoteId));
        quote.setStatus(status);
        quote.setUpdatedAt(OffsetDateTime.now());
        return mapToDto(quotationRepository.save(quote));
    }

    public QuoteRequestDto mapToDto(QuotationRequest quote) {
        QuoteRequestDto dto = new QuoteRequestDto();
        dto.setId(quote.getId());
        dto.setRfqNumber(quote.getRfqNumber());
        dto.setTitle(quote.getTitle());
        dto.setBusinessName(quote.getBusinessName());
        dto.setDeliveryLocation(quote.getDeliveryLocation());
        dto.setRequiredByDate(quote.getRequiredByDate());
        dto.setCreatedDate(quote.getCreatedAt() != null ?
                quote.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "Oct 24, 2023");
        dto.setStatus(quote.getStatus());
        dto.setPriority(quote.getPriority());
        dto.setDetails(quote.getDetails());
        dto.setSelectedSupplierId(quote.getSelectedSupplierId());
        dto.setSelectedResponseId(quote.getSelectedResponseId());

        if (quote.getItems() != null) {
            dto.setProducts(quote.getItems().stream().map(item -> new ProductItemDto(
                    item.getId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getUnit(),
                    item.getSpecs(),
                    item.getReference()
            )).collect(Collectors.toList()));
        }

        if (quote.getResponses() != null) {
            dto.setResponses(quote.getResponses().stream().map(this::mapResponseToDto).collect(Collectors.toList()));
        }

        return dto;
    }

    public QuotationResponseDto mapResponseToDto(SupplierQuotation resp) {
        QuotationResponseDto dto = new QuotationResponseDto();
        dto.setId(resp.getId());
        dto.setQuoteId(resp.getQuotationRequest().getId());
        dto.setSupplierId(resp.getSupplier() != null ? resp.getSupplier().getId() : ("sup-" + resp.getId()));
        dto.setSupplierName(resp.getSupplierName());
        dto.setSupplierTier(resp.getSupplierTier());
        dto.setSupplierContact(new SupplierContactDto(
                resp.getContactName() != null ? resp.getContactName() : "Sarah Jenkins",
                resp.getContactRole() != null ? resp.getContactRole() : "Account Manager",
                resp.getContactEmail() != null ? resp.getContactEmail() : "s.jenkins@nexusglobal.com",
                resp.getContactPhone() != null ? resp.getContactPhone() : "+1 (555) 902-1144"
        ));
        dto.setSubmittedDate(resp.getSubmittedAt() != null ?
                resp.getSubmittedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "Oct 24, 2023");
        dto.setValidityDays(resp.getValidityDays());
        dto.setGeneralTerms(resp.getGeneralTerms());
        dto.setShippingRoute(resp.getShippingRoute());
        dto.setEstDeliveryDays(resp.getEstDeliveryDays());
        dto.setTotalAmount(resp.getTotalAmount());
        dto.setStatus(resp.getStatus());

        if (resp.getItems() != null) {
            dto.setItems(resp.getItems().stream().map(i -> new SupplierOfferItemDto(
                    i.getProductId(),
                    i.isAvailable(),
                    i.getUnitPrice(),
                    i.getEstDeliveryDate(),
                    i.getNotes()
            )).collect(Collectors.toList()));
        }

        if (resp.getAlternativeProduct() != null) {
            dto.setAlternativeProduct(new AlternativeProductDto(
                    resp.getAlternativeProduct().getName(),
                    resp.getAlternativeProduct().getProposedPrice(),
                    resp.getAlternativeProduct().getReason()
            ));
        }

        return dto;
    }
}
