package com.quotebridge.controller;

import com.quotebridge.domain.entity.User;
import com.quotebridge.domain.enums.QuoteStatus;
import com.quotebridge.dto.common.ApiResponse;
import com.quotebridge.dto.quotation.CreateQuoteRequestDto;
import com.quotebridge.dto.quotation.QuoteRequestDto;
import com.quotebridge.service.QuotationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/quotations")
@Tag(name = "Quotation Requests", description = "Endpoints for creating, managing, and browsing RFQs")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @GetMapping
    @Operation(summary = "Get all quotation requests with optional filtering and pagination")
    public ResponseEntity<ApiResponse<List<QuoteRequestDto>>> getQuotations(
            @RequestParam(required = false) QuoteStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "false") boolean paged,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        if (!paged && (search == null || search.isBlank()) && status == null) {
            List<QuoteRequestDto> list = quotationService.getAllQuotationsList();
            return ResponseEntity.ok(ApiResponse.success("Quotations retrieved", list));
        }

        Page<QuoteRequestDto> quotesPage = quotationService.getQuotations(
                status,
                search,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return ResponseEntity.ok(ApiResponse.success("Quotations retrieved", quotesPage.getContent()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quotation request by ID or RFQ Number")
    public ResponseEntity<ApiResponse<QuoteRequestDto>> getQuotationById(@PathVariable String id) {
        QuoteRequestDto quote = quotationService.getQuotationById(id);
        return ResponseEntity.ok(ApiResponse.success("Quotation details retrieved", quote));
    }

    @PostMapping
    @Operation(summary = "Create a new quotation request")
    public ResponseEntity<ApiResponse<QuoteRequestDto>> createQuotation(
            @Valid @RequestBody CreateQuoteRequestDto request,
            @AuthenticationPrincipal User currentUser
    ) {
        QuoteRequestDto created = quotationService.createQuotation(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quotation request created successfully", created));
    }

    @PostMapping("/{id}/select-response")
    @Operation(summary = "Select a supplier response for this quotation request")
    public ResponseEntity<ApiResponse<QuoteRequestDto>> selectResponse(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String responseId = body.get("responseId");
        if (responseId == null || responseId.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("responseId is required"));
        }
        QuoteRequestDto updated = quotationService.selectSupplierResponse(id, responseId);
        return ResponseEntity.ok(ApiResponse.success("Supplier response selected", updated));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update status of a quotation request")
    public ResponseEntity<ApiResponse<QuoteRequestDto>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("status is required"));
        }
        QuoteStatus status = QuoteStatus.valueOf(statusStr);
        QuoteRequestDto updated = quotationService.updateQuotationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Quotation status updated", updated));
    }
}
