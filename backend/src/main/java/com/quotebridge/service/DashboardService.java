package com.quotebridge.service;

import com.quotebridge.domain.enums.QuoteStatus;
import com.quotebridge.dto.dashboard.DashboardSummaryDto;
import com.quotebridge.dto.quotation.QuoteRequestDto;
import com.quotebridge.repository.QuotationRequestRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final QuotationRequestRepository quotationRequestRepository;
    private final QuotationService quotationService;

    public DashboardService(QuotationRequestRepository quotationRequestRepository,
                            QuotationService quotationService) {
        this.quotationRequestRepository = quotationRequestRepository;
        this.quotationService = quotationService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary() {
        long pendingCount = quotationRequestRepository.countByStatus(QuoteStatus.Pending);
        long receivedCount = quotationRequestRepository.countByStatus(QuoteStatus.Received);
        long activeCount = pendingCount + receivedCount;

        List<QuoteRequestDto> recentQuotes = quotationRequestRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent().stream()
                .map(quotationService::mapToDto)
                .collect(Collectors.toList());

        return new DashboardSummaryDto(activeCount, pendingCount, receivedCount, recentQuotes);
    }
}
