import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { QuoteRequest } from '../../types';

export const QuoteHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Accepted' | 'Pending' | 'Rejected' | 'Expired'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    setQuotes(StorageService.getQuotes());
    StorageService.getQuotesAsync().then((live) => {
      if (live && live.length > 0) setQuotes(live);
    });
  }, []);

  // Filter & Search Logic
  const filteredQuotes = quotes.filter((q) => {
    // Status Filter
    if (activeFilter === 'Accepted' && q.status !== 'Accepted') return false;
    if (activeFilter === 'Pending' && q.status !== 'Pending' && q.status !== 'Draft') return false;
    if (activeFilter === 'Rejected' && q.status !== 'Rejected') return false;
    if (activeFilter === 'Expired' && q.status !== 'Expired') return false;

    // Search Filter
    if (searchQuery.trim() !== '') {
      const qLower = searchQuery.toLowerCase();
      const matchId = q.rfqNumber.toLowerCase().includes(qLower);
      const matchTitle = q.title.toLowerCase().includes(qLower);
      const matchSupplier = q.responses.some((r) => r.supplierName.toLowerCase().includes(qLower));
      const matchBiz = q.businessName.toLowerCase().includes(qLower);
      return matchId || matchTitle || matchSupplier || matchBiz;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage) || 1;
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-status-success/10 text-status-success text-label-sm font-label-sm font-semibold">
            Accepted
          </span>
        );
      case 'Pending':
      case 'Draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm font-label-sm font-semibold">
            Pending
          </span>
        );
      case 'Received':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-status-success/10 text-status-success text-label-sm font-label-sm font-semibold">
            Received
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-status-error/10 text-status-error text-label-sm font-label-sm font-semibold">
            Rejected
          </span>
        );
      case 'Expired':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-status-warning/10 text-status-warning text-label-sm font-label-sm font-semibold">
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-sm font-semibold">
            {status}
          </span>
        );
    }
  };

  const getSupplierIcon = (name: string) => {
    if (name.includes('Azure') || name.includes('Cloud')) return 'apartment';
    if (name.includes('Cyber') || name.includes('Security')) return 'shield';
    if (name.includes('Global') || name.includes('Hardware')) return 'inventory_2';
    if (name.includes('Build') || name.includes('Construction')) return 'construction';
    if (name.includes('Dev') || name.includes('Software')) return 'code';
    if (name.includes('Swift') || name.includes('Metro')) return 'local_shipping';
    return 'business';
  };

  const handleExportCSV = () => {
    let csv = 'RFQ Number,Title,Business,Supplier,Date Created,Final Price,Status\n';
    filteredQuotes.forEach((q) => {
      const supplierName = q.responses[0]?.supplierName || 'Multiple / Pending';
      const price = q.responses[0]?.totalAmount ? `₹${q.responses[0].totalAmount.toFixed(2)}` : 'N/A';
      csv += `"${q.rfqNumber}","${q.title}","${q.businessName}","${supplierName}","${q.createdDate}","${price}","${q.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotebridge_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <main className="max-w-container-max mx-auto px-4 py-6 md:px-margin-lg md:py-margin-md pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface font-bold">Quote History</h2>
          <p className="text-body-md font-body-md text-text-muted">
            Review and manage your past business interactions and completed cycles.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-text-primary hover:bg-surface-container-high transition-all shadow-sm font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="text-label-md font-label-md">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
          {(['All', 'Accepted', 'Pending', 'Rejected', 'Expired'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-label-md font-label-md whitespace-nowrap font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container border border-border-subtle text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {filter === 'All' ? 'All Quotes' : filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[300px]">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            style={{ fontSize: '20px' }}
          >
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-md font-body-md"
            placeholder="Search supplier or ID..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Quote Table / List */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-subtle border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 text-label-sm font-label-sm uppercase text-text-muted tracking-wider font-semibold">
                  Quote Details
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm uppercase text-text-muted tracking-wider font-semibold">
                  Supplier
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm uppercase text-text-muted tracking-wider font-semibold">
                  Date Created
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm uppercase text-text-muted tracking-wider font-semibold">
                  Final Price
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm uppercase text-text-muted tracking-wider font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm uppercase text-text-muted tracking-wider text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {paginatedQuotes.map((quote) => {
                const primaryResp = quote.responses[0];
                const supplierName = primaryResp?.supplierName || (quote.responses.length > 1 ? 'Multiple Suppliers' : 'Pending Vendor');
                const priceDisplay = primaryResp?.totalAmount
                  ? `₹${primaryResp.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : 'Pending';

                const isDropdownOpen = openDropdownId === quote.id;

                return (
                  <tr key={quote.id} className="hover:bg-surface-subtle transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-body-md font-semibold text-on-surface">
                          {quote.rfqNumber}
                        </span>
                        <span className="text-body-sm font-body-sm text-text-muted">
                          {quote.title}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '18px' }}
                          >
                            {getSupplierIcon(supplierName)}
                          </span>
                        </div>
                        <span className="text-body-md font-body-md text-on-surface font-medium">
                          {supplierName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-body-md font-body-md text-text-muted">
                      {quote.createdDate}
                    </td>

                    <td className="px-6 py-4 text-body-md font-semibold text-on-surface">
                      {priceDisplay}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(quote.status)}
                    </td>

                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : quote.id)}
                        className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-container"
                        aria-label="More options"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div
                          className="absolute right-6 top-12 z-30 w-48 bg-white border border-border-subtle rounded-xl shadow-xl py-1 text-left animate-in fade-in"
                          onMouseLeave={() => setOpenDropdownId(null)}
                        >
                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              navigate(`/compare?quoteId=${quote.id}`);
                            }}
                            className="w-full px-4 py-2 text-sm text-on-surface hover:bg-surface-subtle flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              compare_arrows
                            </span>
                            Compare Offers
                          </button>

                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              navigate(`/supplier-quote/${quote.id}`);
                            }}
                            className="w-full px-4 py-2 text-sm text-on-surface hover:bg-surface-subtle flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              store
                            </span>
                            Supplier Entry
                          </button>

                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              navigate(`/order-confirmation?quoteId=${quote.id}`);
                            }}
                            className="w-full px-4 py-2 text-sm text-on-surface hover:bg-surface-subtle flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px] text-status-success">
                              receipt_long
                            </span>
                            Order &amp; PO
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginatedQuotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                    <p className="text-body-lg">No quotes matched your filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-surface-subtle">
          <span className="text-label-md font-label-md text-text-muted">
            Showing {paginatedQuotes.length} of {filteredQuotes.length} quotes
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-surface-container transition-colors text-outline disabled:opacity-40"
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-label-md font-label-md transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-on-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-surface-container transition-colors text-outline disabled:opacity-40"
              aria-label="Next page"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
