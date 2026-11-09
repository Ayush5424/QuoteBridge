package com.quotebridge.dto.dashboard;

import com.quotebridge.dto.quotation.QuoteRequestDto;
import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryDto {
    private long activeRequestsCount;
    private long waitingResponseCount;
    private long quotesReceivedCount;
    private List<QuoteRequestDto> recentQuotes = new ArrayList<>();

    public DashboardSummaryDto() {}

    public DashboardSummaryDto(long activeRequestsCount, long waitingResponseCount, long quotesReceivedCount, List<QuoteRequestDto> recentQuotes) {
        this.activeRequestsCount = activeRequestsCount;
        this.waitingResponseCount = waitingResponseCount;
        this.quotesReceivedCount = quotesReceivedCount;
        this.recentQuotes = recentQuotes;
    }

    public long getActiveRequestsCount() { return activeRequestsCount; }
    public void setActiveRequestsCount(long activeRequestsCount) { this.activeRequestsCount = activeRequestsCount; }

    public long getWaitingResponseCount() { return waitingResponseCount; }
    public void setWaitingResponseCount(long waitingResponseCount) { this.waitingResponseCount = waitingResponseCount; }

    public long getQuotesReceivedCount() { return quotesReceivedCount; }
    public void setQuotesReceivedCount(long quotesReceivedCount) { this.quotesReceivedCount = quotesReceivedCount; }

    public List<QuoteRequestDto> getRecentQuotes() { return recentQuotes; }
    public void setRecentQuotes(List<QuoteRequestDto> recentQuotes) { this.recentQuotes = recentQuotes; }
}
