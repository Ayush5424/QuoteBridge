package com.quotebridge.controller;

import com.quotebridge.dto.common.ApiResponse;
import com.quotebridge.dto.comparison.ComparisonSummaryDto;
import com.quotebridge.service.ComparisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/quotations")
@Tag(name = "Quote Comparison", description = "Endpoints for comparing supplier quotes side-by-side")
public class ComparisonController {

    private final ComparisonService comparisonService;

    public ComparisonController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @GetMapping("/{id}/comparison")
    @Operation(summary = "Get full comparison summary and matrix for a quotation request")
    public ResponseEntity<ApiResponse<ComparisonSummaryDto>> getComparison(@PathVariable String id) {
        ComparisonSummaryDto summary = comparisonService.getComparisonSummary(id);
        return ResponseEntity.ok(ApiResponse.success("Comparison summary generated", summary));
    }
}
