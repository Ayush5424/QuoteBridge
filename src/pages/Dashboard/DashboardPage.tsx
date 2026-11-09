import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { QuoteRequest } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [showTrendsModal, setShowTrendsModal] = useState(false);

  useEffect(() => {
    setQuotes(StorageService.getQuotes());
  }, []);

  // Compute live metrics
  const activeRequestsCount = quotes.filter((q) => q.status !== 'Rejected' && q.status !== 'Expired').length;
  const waitingResponseCount = quotes.filter((q) => q.status === 'Pending').length;
  const quotesReceivedCount = quotes.filter((q) => q.status === 'Received' || q.status === 'Accepted').length;

  // Recent quote requests (first 5)
  const recentQuotes = quotes.slice(0, 5);

  const getStatusBadge = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'Received':
        return (
          <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-status-success/10 text-status-success font-medium">
            Received
          </span>
        );
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-status-warning/10 text-status-warning font-medium">
            Pending
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-primary/10 text-primary font-medium">
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-status-error/10 text-status-error font-medium">
            Rejected
          </span>
        );
      case 'Expired':
        return (
          <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-surface-container-high text-text-muted font-medium">
            Expired
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-surface-container text-on-surface-variant font-medium">
            {status}
          </span>
        );
    }
  };

  const getQuoteIcon = (index: number) => {
    const icons = ['inventory_2', 'group', 'local_shipping', 'precision_manufacturing', 'hub'];
    return icons[index % icons.length];
  };

  const handleQuoteClick = (quote: QuoteRequest) => {
    // If order has been accepted/confirmed, navigate to order confirmation
    const order = StorageService.getOrderByQuoteId(quote.id);
    if (order || quote.status === 'Accepted') {
      navigate(order ? `/order-confirmation/${order.id}` : `/order-confirmation?quoteId=${quote.id}`);
      return;
    }
    // If quote has multiple responses or is received, go to comparison
    if (quote.responses && quote.responses.length > 0) {
      navigate(`/compare?quoteId=${quote.id}`);
      return;
    }
    // If pending, allow opening supplier quote view to submit prices!
    navigate(`/supplier-quote/${quote.id}`);
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-sm md:px-margin-lg py-8 pb-24 md:pb-12">
      {/* Welcome Section */}
      <div className="mb-10">
        <h2 className="text-display font-display text-primary mb-2">Welcome back, Alex</h2>
        <p className="text-body-lg font-body-lg text-text-muted">
          Here's what's happening with your supply chain today.
        </p>
      </div>

      {/* Quick Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Active Requests */}
        <div className="stat-card-gradient p-6 rounded-xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <span className="material-symbols-outlined text-primary">pending_actions</span>
            </div>
            <span className="text-label-sm font-label-sm text-status-success font-bold">
              +12% vs last month
            </span>
          </div>
          <p className="text-label-md font-label-md text-text-muted uppercase tracking-wider mb-1">
            Active Requests
          </p>
          <h3 className="text-display font-display text-on-surface">{activeRequestsCount}</h3>
        </div>

        {/* Waiting Response */}
        <div className="stat-card-gradient p-6 rounded-xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <span className="material-symbols-outlined text-status-warning">hourglass_empty</span>
            </div>
          </div>
          <p className="text-label-md font-label-md text-text-muted uppercase tracking-wider mb-1">
            Waiting Response
          </p>
          <h3 className="text-display font-display text-on-surface">{waitingResponseCount}</h3>
        </div>

        {/* Quotes Received */}
        <div className="stat-card-gradient p-6 rounded-xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <span className="material-symbols-outlined text-status-success">task_alt</span>
            </div>
          </div>
          <p className="text-label-md font-label-md text-text-muted uppercase tracking-wider mb-1">
            Quotes Received
          </p>
          <h3 className="text-display font-display text-on-surface">{quotesReceivedCount}</h3>
        </div>
      </section>

      {/* Main Content Area: Recent Quotes & Action */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Recent Quotes Section */}
        <section className="flex-grow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-headline-lg font-headline-lg text-primary">Recent Quote Requests</h3>
            <Link
              to="/history"
              className="text-primary text-label-md font-label-md hover:underline flex items-center gap-1 font-semibold"
            >
              View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="space-y-4">
            {recentQuotes.map((quote, idx) => {
              const primarySupplier = quote.responses[0]?.supplierName || 'Multiple Suppliers';
              const displaySupplier = quote.responses.length > 1 ? 'Multiple Suppliers' : (quote.responses[0]?.supplierName || 'Awaiting Suppliers');

              return (
                <div
                  key={quote.id}
                  onClick={() => handleQuoteClick(quote)}
                  className="bg-surface-container-lowest border border-border-subtle p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between hover:border-primary/40 hover:bg-surface-subtle transition-all cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary-container group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">{getQuoteIcon(idx)}</span>
                    </div>
                    <div>
                      <h4 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">
                        {displaySupplier}
                      </h4>
                      <p className="text-body-sm font-body-sm text-text-muted">
                        {quote.rfqNumber} • {quote.createdDate} • {quote.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0 justify-between md:justify-end">
                    <div className="text-right hidden md:block">
                      <p className="text-label-sm font-label-sm text-text-muted uppercase">Expected</p>
                      <p className="text-body-md font-body-md font-medium text-on-surface">
                        {quote.requiredByDate}
                      </p>
                    </div>
                    {getStatusBadge(quote.status)}
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </div>
              );
            })}

            {recentQuotes.length === 0 && (
              <div className="bg-surface-container-lowest border border-border-subtle p-12 rounded-xl text-center">
                <span className="material-symbols-outlined text-4xl text-text-muted mb-2">inbox</span>
                <p className="text-body-lg text-text-muted">No quote requests yet.</p>
                <Link
                  to="/create-quote"
                  className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm"
                >
                  Create your first quote
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar / Action Section */}
        <aside className="lg:w-80 space-y-6">
          {/* Action Card */}
          <div className="bg-primary p-8 rounded-2xl text-on-primary shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-headline-lg font-headline-lg mb-4 text-white font-bold">Need a new quote?</h4>
              <p className="text-body-md font-body-md mb-8 text-white/90">
                Quickly send requests to your pre-approved suppliers or explore new vendors.
              </p>
              <button
                onClick={() => navigate('/create-quote')}
                className="w-full bg-white text-primary font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-on-primary-container transition-colors shadow-sm active:scale-95 duration-150"
              >
                <span className="material-symbols-outlined">add_circle</span>
                New Quote
              </button>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">handshake</span>
            </div>
          </div>

          {/* Secondary Info Card */}
          <div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant">
            <h5 className="text-label-md font-label-md text-primary uppercase mb-4 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-[18px]">insights</span>
              Market Trends
            </h5>
            <p className="text-body-sm font-body-sm text-on-surface-variant mb-4">
              Logistics costs in your region are down 4% this week. It's a good time to lock in long-term quotes.
            </p>
            <button
              onClick={() => setShowTrendsModal(true)}
              className="text-primary text-label-sm font-label-sm font-bold flex items-center gap-1 hover:underline"
            >
              Read Analytics Report <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          {/* Quick Workflow Guide Card */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle shadow-sm">
            <h5 className="text-label-md font-label-md text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary text-[18px]">alt_route</span>
              Quotation Flow
            </h5>
            <ol className="text-body-sm text-text-muted space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span><strong className="text-text-primary">Create Quote:</strong> Specify products and dispatch RFQ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span><strong className="text-text-primary">Supplier Quote:</strong> Vendors input unit prices and delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span><strong className="text-text-primary">Compare Offers:</strong> Analyze pricing, timelines, & savings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span><strong className="text-text-primary">Confirm Order:</strong> Issue Purchase Order and lock terms.</span>
              </li>
            </ol>
          </div>
        </aside>
      </div>

      {/* FAB for Mobile */}
      <button
        onClick={() => navigate('/create-quote')}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center z-50 active:scale-90 transition-transform"
        aria-label="New Quote"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Market Trends Analytics Modal */}
      {showTrendsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">insights</span>
                <h3 className="text-headline-md font-bold text-on-surface">Q4 Supply Chain Analytics</h3>
              </div>
              <button
                onClick={() => setShowTrendsModal(false)}
                className="text-text-muted hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4 text-body-md text-on-surface-variant">
              <div className="p-4 bg-surface-subtle rounded-xl border border-border-subtle">
                <p className="text-label-md font-bold text-primary mb-1">Regional Freight Rates</p>
                <p className="text-body-sm">
                  Ocean container spot rates from East Asia to US West Coast dropped by 4.2% week-over-week. Rail freight indices remain stable (+0.4%).
                </p>
              </div>
              <div className="p-4 bg-surface-subtle rounded-xl border border-border-subtle">
                <p className="text-label-md font-bold text-status-success mb-1">Recommended Action</p>
                <p className="text-body-sm">
                  Suppliers are offering larger volume discounts (up to 8%) on hardware and technical assemblies for commitments exceeding 90 days.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTrendsModal(false)}
                className="bg-primary text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-primary-container transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
