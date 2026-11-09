package com.quotebridge.controller;

import com.quotebridge.domain.entity.User;
import com.quotebridge.dto.common.ApiResponse;
import com.quotebridge.dto.quotation.QuotationResponseDto;
import com.quotebridge.service.SupplierQuotationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quotations")
@Tag(name = "Supplier Quotations", description = "Endpoints for supplier quote proposals and bids")
public class SupplierQuotationController {

    private final SupplierQuotationService supplierQuotationService;

    public SupplierQuotationController(SupplierQuotationService supplierQuotationService) {
        this.supplierQuotationService = supplierQuotationService;
    }

    @PostMapping("/{id}/responses")
    @Operation(summary = "Submit a supplier response / quote for an RFQ")
    public ResponseEntity<ApiResponse<QuotationResponseDto>> submitResponse(
            @PathVariable String id,
            @Valid @RequestBody QuotationResponseDto responseDto,
            @AuthenticationPrincipal User currentUser
    ) {
        QuotationResponseDto created = supplierQuotationService.submitQuotationResponse(id, responseDto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quotation response submitted successfully", created));
    }

    @GetMapping("/{id}/responses")
    @Operation(summary = "Get all supplier responses for a quotation request")
    public ResponseEntity<ApiResponse<List<QuotationResponseDto>>> getResponsesForQuotation(@PathVariable String id) {
        List<QuotationResponseDto> responses = supplierQuotationService.getResponsesForQuotation(id);
        return ResponseEntity.ok(ApiResponse.success("Responses retrieved", responses));
    }

    @GetMapping("/{quoteId}/responses/{responseId}")
    @Operation(summary = "Get a specific supplier response by ID")
    public ResponseEntity<ApiResponse<QuotationResponseDto>> getResponseById(
            @PathVariable String quoteId,
            @PathVariable String responseId
    ) {
        QuotationResponseDto response = supplierQuotationService.getResponseById(responseId);
        return ResponseEntity.ok(ApiResponse.success("Response retrieved", response));
    }
}
