import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { QuoteRequest, SupplierResponse } from '../../types';

export const QuoteComparisonPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteIdParam = searchParams.get('quoteId');

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [selectedSupplierResp, setSelectedSupplierResp] = useState<SupplierResponse | null>(null);
  const [revisionModal, setRevisionModal] = useState<{ open: boolean; supplierName: string }>({
    open: false,
    supplierName: '',
  });
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionSuccess, setRevisionSuccess] = useState(false);

  useEffect(() => {
    const allQuotes = StorageService.getQuotes();
    setQuotes(allQuotes);

    let active: QuoteRequest | undefined;
    if (quoteIdParam) {
      active = allQuotes.find((q) => q.id === quoteIdParam || q.rfqNumber === quoteIdParam);
    }
    // Fallback to quotes that have multiple responses, or quote-2 (Workstation Tech)
    if (!active) {
      active = allQuotes.find((q) => q.responses && q.responses.length > 1) || allQuotes[1] || allQuotes[0];
    }

    if (active) {
      setSelectedQuote(active);
    }
  }, [quoteIdParam]);

  if (!selectedQuote) {
    return (
      <div className="max-w-container-max mx-auto px-margin-md py-12 text-center">
        <h2 className="text-headline-lg font-bold">No Comparison Available</h2>
        <p className="text-body-md text-text-muted mt-2">Please select an RFQ with supplier responses to compare.</p>
      </div>
    );
  }

  const responses = selectedQuote.responses || [];

  // Identify Best Price & Speed Leader
  let bestPriceResp: SupplierResponse | null = null;
  let fastestResp: SupplierResponse | null = null;

  if (responses.length > 0) {
    bestPriceResp = [...responses].sort((a, b) => a.totalAmount - b.totalAmount)[0];
    fastestResp = [...responses].sort((a, b) => (a.estDeliveryDays || 99) - (b.estDeliveryDays || 99))[0];
  }

  // Calculate savings compared to average or highest
  const highestPrice = responses.length > 0 ? Math.max(...responses.map((r) => r.totalAmount)) : 0;
  const bestPrice = bestPriceResp ? bestPriceResp.totalAmount : 0;
  const savings = highestPrice > bestPrice ? highestPrice - bestPrice : 2350;

  // Handle supplier selection & proceeding to Order Confirmation
  const handleAcceptSupplier = (resp: SupplierResponse) => {
    // Associate selected supplier response with the quotation
    const updatedQuote: QuoteRequest = {
      ...selectedQuote,
      selectedSupplierId: resp.supplierId,
      selectedResponseId: resp.id,
      status: 'Received',
    };
    StorageService.saveQuote(updatedQuote);

    // Navigate to Order Confirmation with quoteId and responseId
    navigate(`/order-confirmation?quoteId=${selectedQuote.id}&responseId=${resp.id}`);
  };

  const handleRequestRevision = (supplierName: string) => {
    setRevisionModal({ open: true, supplierName });
    setRevisionNotes(`Requesting revised quote for ${supplierName}: volume discount for bulk payment or faster shipment.`);
  };

  const submitRevision = () => {
    setRevisionSuccess(true);
    setTimeout(() => {
      setRevisionSuccess(false);
      setRevisionModal({ open: false, supplierName: '' });
      alert(`Revision request dispatched to ${revisionModal.supplierName}.`);
    }, 1200);
  };

  const exportAnalysisCSV = () => {
    let csv = `Item Details,Qty,${responses.map((r) => `"${r.supplierName}"`).join(',')}\n`;
    selectedQuote.products.forEach((prod) => {
      const prices = responses.map((r) => {
        const item = r.items?.find((i) => i.productId === prod.id);
        return item?.available ? `₹${item.unitPrice}` : 'N/A';
      });
      csv += `"${prod.name} - ${prod.specs || ''}",${prod.quantity},${prices.join(',')}\n`;
    });
    csv += `Subtotal,-,${responses.map((r) => `₹${r.totalAmount}`).join(',')}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quote_analysis_${selectedQuote.rfqNumber.replace('#', '')}.csv`;
    link.click();
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-md py-8 pb-24">
      {/* Quotation Selector & Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-surface-container-low p-4 rounded-xl border border-border-subtle">
        <div>
          <span className="text-label-sm font-label-sm text-primary uppercase font-bold tracking-wider">
            Comparative Quotation Analysis
          </span>
          <h2 className="text-headline-md font-bold text-on-surface">
            {selectedQuote.title} ({selectedQuote.rfqNumber})
          </h2>
          <p className="text-body-sm text-text-muted">
            {selectedQuote.businessName} • {responses.length} Quotes Received • Destination: {selectedQuote.deliveryLocation}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-label-sm font-label-sm text-text-muted whitespace-nowrap">Switch RFQ:</label>
          <select
            className="px-3 py-1.5 bg-white border border-border-subtle rounded-lg text-sm text-body-md focus:ring-2 focus:ring-primary outline-none"
            value={selectedQuote.id}
            onChange={(e) => {
              const q = quotes.find((quote) => quote.id === e.target.value);
              if (q) setSelectedQuote(q);
            }}
          >
            {quotes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.rfqNumber} - {q.title} ({q.responses?.length || 0} quotes)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Summary (USP Section) */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Best Value Card */}
          <div className="bg-surface-container-lowest border border-border-subtle p-6 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-status-success/10 flex items-center justify-center text-status-success flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">savings</span>
            </div>
            <div>
              <p className="text-label-md font-label-md text-text-muted font-semibold">Best Value</p>
              <p className="text-headline-md font-headline-md text-on-surface">
                You save <span className="text-status-success font-bold">₹{savings.toLocaleString()}</span> by choosing{' '}
                {bestPriceResp?.supplierName || 'Supplier B'}
              </p>
            </div>
          </div>

          {/* Speed Leader Card */}
          <div className="bg-surface-container-lowest border border-border-subtle p-6 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">bolt</span>
            </div>
            <div>
              <p className="text-label-md font-label-md text-text-muted font-semibold">Speed Leader</p>
              <p className="text-headline-md font-headline-md text-on-surface">
                {fastestResp?.supplierName || 'Metro Supplies'} is{' '}
                <span className="text-primary font-bold">{fastestResp?.estDeliveryDays || 2} days turnaround</span>
              </p>
            </div>
          </div>

          {/* Inventory Match Card */}
          <div className="bg-surface-container-lowest border border-border-subtle p-6 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-status-warning/10 flex items-center justify-center text-status-warning flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">inventory</span>
            </div>
            <div>
              <p className="text-label-md font-label-md text-text-muted font-semibold">Inventory Match</p>
              <p className="text-headline-md font-headline-md text-on-surface">
                Full fulfillment on <span className="text-on-surface font-bold">{selectedQuote.products.length}/{selectedQuote.products.length} line items</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Cards (Horizontal Scroll for Mobile/Tablet) */}
      <section className="mb-10">
        <h2 className="text-headline-lg font-headline-lg text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">compare_arrows</span>
          Supplier Comparison
        </h2>

        <div className="flex flex-nowrap overflow-x-auto gap-gutter pb-4 custom-scrollbar">
          {responses.map((resp, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isBestPrice = bestPriceResp?.id === resp.id;
            const isFastest = fastestResp?.id === resp.id && !isBestPrice;

            // Border styling
            let borderClass = 'border-border-subtle';
            if (isBestPrice) borderClass = 'border-2 border-status-success';
            else if (isFastest) borderClass = 'border-2 border-primary';

            // Available items count
            const availCount = resp.items?.filter((i) => i.available).length || selectedQuote.products.length;

            return (
              <div
                key={resp.id}
                className={`min-w-[320px] max-w-[360px] flex-1 bg-surface-container-lowest ${borderClass} rounded-xl p-6 relative transition-all hover:shadow-md`}
              >
                {/* Badge Pills */}
                {isBestPrice && (
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-status-success text-on-primary text-label-sm font-label-sm rounded-full font-bold shadow-sm">
                    BEST PRICE
                  </div>
                )}
                {isFastest && (
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-primary text-on-primary text-label-sm font-label-sm rounded-full font-bold shadow-sm">
                    FASTEST
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-primary text-lg">
                      {letter}
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                        {resp.supplierName}
                      </h3>
                      <p className="text-label-sm font-label-sm text-text-muted">
                        {resp.supplierTier || 'Verified Supplier'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-body-md font-body-md text-text-muted">Total Quote</span>
                    <span
                      className={`text-headline-md font-headline-md font-bold ${
                        isBestPrice ? 'text-status-success' : 'text-on-surface'
                      }`}
                    >
                      ₹{resp.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-body-md font-body-md text-text-muted">Availability</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-label-sm font-label-sm font-medium ${
                        availCount === selectedQuote.products.length
                          ? 'bg-status-success/10 text-status-success'
                          : 'bg-status-warning/10 text-status-warning'
                      }`}
                    >
                      {availCount}/{selectedQuote.products.length} items
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-body-md font-body-md text-text-muted">Est. Delivery</span>
                    <span
                      className={`text-body-md font-body-md font-semibold ${
                        isFastest ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {resp.estDeliveryDays ? `${resp.estDeliveryDays} Days` : '4-6 Days'}
                    </span>
                  </div>

                  {resp.generalTerms && (
                    <div className="pt-2 border-t border-border-subtle text-body-sm text-text-muted line-clamp-2">
                      <span className="font-semibold text-text-primary">Terms:</span> {resp.generalTerms}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAcceptSupplier(resp)}
                    className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors font-bold shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Accept Supplier</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => handleRequestRevision(resp.supplierName)}
                    className="w-full py-2 border border-border-subtle text-on-surface font-label-md text-label-md hover:bg-surface-subtle transition-colors font-medium"
                  >
                    Request Revision
                  </button>
                </div>
              </div>
            );
          })}

          {responses.length === 0 && (
            <div className="w-full bg-surface-container-lowest border border-border-subtle p-8 rounded-xl text-center">
              <span className="material-symbols-outlined text-4xl text-text-muted mb-2">hourglass_top</span>
              <h4 className="text-headline-md font-bold">Awaiting Supplier Responses</h4>
              <p className="text-body-md text-text-muted mt-1">
                No quotations have been submitted for this RFQ yet.
              </p>
              <button
                onClick={() => navigate(`/supplier-quote/${selectedQuote.id}`)}
                className="mt-4 bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold"
              >
                Submit Quote as Supplier
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Comparative Table (Bento Layout Item - Line Item Analysis) */}
      <section className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface-subtle">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Line Item Analysis</h3>
          <div className="flex gap-2">
            <button
              onClick={exportAnalysisCSV}
              className="p-2 hover:bg-surface-container rounded-lg text-text-muted hover:text-on-surface flex items-center gap-1 text-sm font-medium"
              title="Download CSV Analysis"
            >
              <span className="material-symbols-outlined" data-icon="download">
                download
              </span>
              <span className="hidden sm:inline">Export Analysis</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-subtle">
                <th className="px-6 py-4 font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Qty
                </th>
                {responses.map((resp, idx) => (
                  <th
                    key={resp.id}
                    className={`px-6 py-4 font-label-sm text-label-sm text-text-muted uppercase tracking-wider ${
                      idx % 2 === 1 ? 'bg-surface-container/50' : 'bg-surface-container/30'
                    }`}
                  >
                    Supplier {String.fromCharCode(65 + idx)} ({resp.supplierName.split(' ')[0]})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {selectedQuote.products.map((prod) => {
                // Find lowest price for this line item among available responses
                const prices = responses
                  .map((r) => r.items?.find((i) => i.productId === prod.id))
                  .filter((item): item is NonNullable<typeof item> => !!item && item.available && item.unitPrice > 0)
                  .map((item) => item.unitPrice);

                const minPrice = prices.length > 0 ? Math.min(...prices) : null;

                return (
                  <tr key={prod.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-body-md text-on-surface font-semibold">{prod.name}</div>
                      <div className="text-label-sm text-text-muted">
                        {prod.specs || prod.reference || `SKU-${prod.id.slice(-4).toUpperCase()}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-md font-medium">
                      {prod.quantity} {prod.unit}
                    </td>

                    {responses.map((resp) => {
                      const item = resp.items?.find((i) => i.productId === prod.id);
                      if (!item || !item.available || item.unitPrice <= 0) {
                        return (
                          <td key={resp.id} className="px-6 py-4 text-body-md text-status-error font-bold">
                            N/A
                          </td>
                        );
                      }

                      const isLowest = minPrice !== null && item.unitPrice === minPrice;

                      return (
                        <td
                          key={resp.id}
                          className={`px-6 py-4 text-body-md ${
                            isLowest ? 'text-status-success font-bold' : 'text-on-surface'
                          }`}
                        >
                          ₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-surface-container font-bold border-t-2 border-border-subtle">
                <td className="px-6 py-4 text-body-lg" colSpan={2}>
                  Subtotal
                </td>
                {responses.map((resp) => {
                  const isLowest = bestPriceResp?.id === resp.id;
                  return (
                    <td
                      key={resp.id}
                      className={`px-6 py-4 text-body-lg font-bold ${
                        isLowest ? 'text-status-success' : 'text-on-surface'
                      }`}
                    >
                      ₹{resp.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Revision Request Modal */}
      {revisionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-subtle">
            <h3 className="text-headline-md font-bold mb-2">
              Request Revision: {revisionModal.supplierName}
            </h3>
            <p className="text-body-sm text-text-muted mb-4">
              Send a counter-offer or specify target pricing/delivery milestones to negotiate terms.
            </p>
            <textarea
              className="w-full p-3 border border-border-subtle rounded-xl text-body-md resize-none mb-4 focus:ring-2 focus:ring-primary outline-none"
              rows={4}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRevisionModal({ open: false, supplierName: '' })}
                className="px-4 py-2 border border-border-subtle rounded-lg text-sm text-text-muted hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={submitRevision}
                disabled={revisionSuccess}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-container"
              >
                {revisionSuccess ? 'Sending...' : 'Send Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
