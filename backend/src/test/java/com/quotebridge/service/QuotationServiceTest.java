package com.quotebridge.service;

import com.quotebridge.domain.entity.QuotationRequest;
import com.quotebridge.domain.enums.QuoteStatus;
import com.quotebridge.dto.quotation.CreateQuoteRequestDto;
import com.quotebridge.dto.quotation.ProductItemDto;
import com.quotebridge.dto.quotation.QuoteRequestDto;
import com.quotebridge.repository.*;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuotationServiceTest {

    @Mock
    private QuotationRequestRepository quotationRepository;
    @Mock
    private OrganizationRepository organizationRepository;
    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private SupplierQuotationRepository supplierQuotationRepository;

    @InjectMocks
    private QuotationService quotationService;

    private CreateQuoteRequestDto requestDto;

    @BeforeEach
    void setUp() {
        requestDto = new CreateQuoteRequestDto();
        requestDto.setTitle("Organic Gala Apples bulk request");
        requestDto.setBusinessName("Fresh Market Co.");
        requestDto.setDeliveryLocation("Warehouse A, Sector 4, Indirapuram, Ghaziabad");
        requestDto.setRequiredByDate("Nov 15, 2024");
        requestDto.setPriority("High Priority");

        ProductItemDto product = new ProductItemDto();
        product.setName("Organic Gala Apples");
        product.setQuantity(new BigDecimal("500"));
        product.setUnit("cases");
        product.setSpecs("Grade A, Wax-free, 18kg boxes");
        requestDto.setProducts(List.of(product));
    }

    @Test
    void testCreateQuotation_Success() {
        when(quotationRepository.save(any(QuotationRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuoteRequestDto result = quotationService.createQuotation(requestDto);

        assertNotNull(result);
        assertEquals("Organic Gala Apples bulk request", result.getTitle());
        assertEquals("Fresh Market Co.", result.getBusinessName());
        assertEquals(QuoteStatus.Pending, result.getStatus());
        assertEquals(1, result.getProducts().size());
        assertEquals("Organic Gala Apples", result.getProducts().get(0).getName());
        verify(quotationRepository, times(1)).save(any(QuotationRequest.class));
    }

    @Test
    void testGetQuotationById_NotFound() {
        when(quotationRepository.findById("non-existent")).thenReturn(Optional.empty());
        when(quotationRepository.findByRfqNumber("non-existent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> quotationService.getQuotationById("non-existent"));
    }
}
