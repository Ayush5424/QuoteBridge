import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { QuoteRequest, SupplierOfferItem, AlternativeProduct, SupplierResponse } from '../../types';

export const SupplierQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [supplierName, setSupplierName] = useState('Nexus Global Logistics');
  const [showAlternative, setShowAlternative] = useState(false);

  // Table items state
  const [offerItems, setOfferItems] = useState<{
    [productId: string]: {
      available: boolean;
      unitPrice: number;
      estDeliveryDate: string;
      notes: string;
    };
  }>({});

  // Alternative product state
  const [altProduct, setAltProduct] = useState<AlternativeProduct>({
    name: 'Premium Hemp Blend',
    proposedPrice: 3.90,
    reason: 'Better availability, certified sustainable, lower cost',
  });

  // Terms & Validity
  const [generalTerms, setGeneralTerms] = useState(
    'FOB Destination. Net 30 payment terms. Includes standard cargo insurance coverage.'
  );
  const [validityDays, setValidityDays] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleQuoteLoad = (currentQuote: QuoteRequest | undefined) => {
      if (!currentQuote) return;
      setQuote(currentQuote);

      // Check if this quote already has a response from this supplier
      const existingResp = currentQuote.responses[0];
      const initialMap: { [productId: string]: any } = {};

      currentQuote.products.forEach((prod, index) => {
        const itemResp = existingResp?.items?.find((i) => i.productId === prod.id);
        const defaultPrice = itemResp ? itemResp.unitPrice : (index === 0 ? 4.25 : 12.50);
        const defaultAvail = itemResp ? itemResp.available : true;
        const defaultNotes = itemResp ? (itemResp.notes || '') : '';
        const defaultDate = itemResp?.estDeliveryDate || currentQuote?.requiredByDate || '2023-11-15';

        initialMap[prod.id] = {
          available: defaultAvail,
          unitPrice: defaultPrice,
          estDeliveryDate: defaultDate,
          notes: defaultNotes,
        };
      });

      setOfferItems(initialMap);

      if (existingResp?.supplierName) {
        setSupplierName(existingResp.supplierName);
      }
      if (existingResp?.generalTerms) {
        setGeneralTerms(existingResp.generalTerms);
      }
      if (existingResp?.validityDays) {
        setValidityDays(existingResp.validityDays);
      }
      if (existingResp?.alternativeProduct) {
        setAltProduct(existingResp.alternativeProduct);
        setShowAlternative(true);
      }
    };

    const quotes = StorageService.getQuotes();
    let currentQuote: QuoteRequest | undefined;

    if (id) {
      currentQuote = quotes.find((q) => q.id === id || q.rfqNumber === id);
    }
    if (!currentQuote && quotes.length > 0) {
      currentQuote = quotes[0];
    }

    if (currentQuote) {
      handleQuoteLoad(currentQuote);
    }

    if (id) {
      StorageService.getQuoteByIdAsync(id).then((liveQuote) => {
        if (liveQuote) handleQuoteLoad(liveQuote);
      });
    }
  }, [id]);

  if (!quote) {
    return (
      <div className="max-w-container-max mx-auto px-margin-md py-12 text-center">
        <h2 className="text-headline-lg font-bold">Quote Request Not Found</h2>
        <p className="text-body-md text-text-muted mt-2">The requested RFQ could not be located.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle row changes
  const handleItemChange = (productId: string, field: string, value: any) => {
    setOfferItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  // Compute live total quote amount
  const calculateTotal = (): number => {
    let total = 0;
    quote.products.forEach((prod) => {
      const item = offerItems[prod.id];
      if (item && item.available) {
        total += (Number(prod.quantity) || 0) * (Number(item.unitPrice) || 0);
      }
    });
    return total;
  };

  const totalAmount = calculateTotal();

  const handleSendQuotation = (isDraft = false) => {
    setIsSubmitting(true);

    const itemsPayload: SupplierOfferItem[] = quote.products.map((prod) => {
      const item = offerItems[prod.id] || { available: true, unitPrice: 0, estDeliveryDate: '', notes: '' };
      return {
        productId: prod.id,
        available: item.available,
        unitPrice: Number(item.unitPrice) || 0,
        estDeliveryDate: item.estDeliveryDate,
        notes: item.notes,
      };
    });

    const responseRecord: SupplierResponse = {
      id: `resp-${quote.id}-${Date.now()}`,
      quoteId: quote.id,
      supplierId: `sup-${supplierName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      supplierName,
      supplierTier: 'Verified Enterprise Partner',
      supplierContact: {
        name: 'Sarah Jenkins',
        role: 'Account Manager',
        email: 's.jenkins@nexusglobal.com',
        phone: '+1 (555) 902-1144',
      },
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      validityDays,
      generalTerms,
      shippingRoute: 'Shanghai → Los Angeles',
      estDeliveryDays: 4,
      totalAmount,
      status: isDraft ? 'Pending' : 'Submitted',
      items: itemsPayload,
      alternativeProduct: showAlternative ? altProduct : undefined,
    };

    setTimeout(() => {
      StorageService.addSupplierResponse(quote.id, responseRecord);
      setIsSubmitting(false);

      if (isDraft) {
        setFeedbackSuccess('Draft quotation saved successfully.');
        setTimeout(() => setFeedbackSuccess(null), 3000);
      } else {
        setFeedbackSuccess(`Quotation successfully sent to ${quote.businessName}!`);
        setTimeout(() => {
          navigate(`/compare?quoteId=${quote.id}`);
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-md py-8 pb-32">
      {/* Top Banner showing Supplier context */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container-high p-4 rounded-xl border border-outline-variant">
        <div>
          <span className="text-label-sm font-label-sm text-primary uppercase font-bold tracking-wider">
            Supplier Portal Entry
          </span>
          <h3 className="text-headline-md font-bold text-on-surface">
            Submitting as: {supplierName}
          </h3>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="px-3 py-1.5 bg-white border border-border-subtle rounded-lg text-sm text-body-md"
            title="Change Supplier Company Name"
            placeholder="Supplier Name"
          />
          <button
            onClick={() => navigate(`/compare?quoteId=${quote.id}`)}
            className="text-primary text-label-sm font-label-sm font-bold hover:underline whitespace-nowrap"
          >
            Go to Comparison →
          </button>
        </div>
      </div>

      {/* Summary Header Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
        <div className="md:col-span-2 bento-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <span className="text-label-md font-label-md text-primary uppercase tracking-wider mb-2 block font-semibold">
              RFQ Overview
            </span>
            <h2 className="text-display font-display text-on-surface mb-4">
              Request from: {quote.businessName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-md font-body-md text-text-muted">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-unit">event</span>
                <span>Due: {quote.requiredByDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-unit">location_on</span>
                <span>Region: {quote.deliveryLocation}</span>
              </div>
            </div>
          </div>
          {/* Subtle background decorative pattern */}
          <div className="absolute right-0 top-0 h-full w-32 opacity-5 pointer-events-none">
            <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
              <path className="text-primary" d="M0 100 L100 0 V100 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <div className="bento-card rounded-xl p-6 bg-surface-container-low border-dashed border-2 border-outline-variant">
          <span className="text-label-md font-label-md text-on-surface-variant uppercase mb-4 block font-semibold">
            Request Details
          </span>
          <p className="text-body-md font-body-md text-on-surface leading-relaxed">
            "{quote.details || 'Please provide competitive volume quotes with guaranteed delivery turnaround.'}"
          </p>
          <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
            <span className="text-label-sm font-label-sm text-text-muted font-medium">Priority</span>
            <span className="px-2.5 py-1 rounded-full bg-status-warning bg-opacity-10 text-status-warning text-label-sm font-label-sm font-bold">
              {quote.priority}
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Quote Table */}
      <section className="bento-card rounded-xl overflow-hidden mb-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-subtle">
              <tr>
                <th className="px-6 py-4 text-label-sm font-label-sm text-text-muted uppercase border-b border-border-subtle w-1/4">
                  Product / Specification
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm text-text-muted uppercase border-b border-border-subtle text-center">
                  Req. Qty
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm text-text-muted uppercase border-b border-border-subtle text-center">
                  Available
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm text-text-muted uppercase border-b border-border-subtle">
                  Unit Price (₹)
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm text-text-muted uppercase border-b border-border-subtle">
                  Est. Delivery
                </th>
                <th className="px-6 py-4 text-label-sm font-label-sm text-text-muted uppercase border-b border-border-subtle">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {quote.products.map((prod) => {
                const item = offerItems[prod.id] || {
                  available: true,
                  unitPrice: 0,
                  estDeliveryDate: '',
                  notes: '',
                };

                return (
                  <tr key={prod.id} className="hover:bg-surface-subtle transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-body-md font-semibold text-on-surface">{prod.name}</span>
                        <span className="text-label-sm font-label-sm text-text-muted">
                          {prod.specs || prod.reference || `Item Ref: ${prod.id.slice(-6).toUpperCase()}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-body-md font-body-md font-medium">
                      {prod.quantity} {prod.unit}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={(e) => handleItemChange(prod.id, 'available', e.target.checked)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-body-sm font-semibold">
                          ₹
                        </span>
                        <input
                          className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-body-md text-right font-medium disabled:opacity-50"
                          step="0.01"
                          type="number"
                          disabled={!item.available}
                          value={item.unitPrice || ''}
                          onChange={(e) => handleItemChange(prod.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-body-md disabled:opacity-50"
                        type="date"
                        disabled={!item.available}
                        value={item.estDeliveryDate}
                        onChange={(e) => handleItemChange(prod.id, 'estDeliveryDate', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-body-md disabled:opacity-50"
                        placeholder="Add comment..."
                        type="text"
                        disabled={!item.available}
                        value={item.notes}
                        onChange={(e) => handleItemChange(prod.id, 'notes', e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suggest Alternative Section */}
      <section className="mb-8">
        <button
          className="flex items-center gap-2 text-primary hover:text-on-primary-fixed-variant transition-colors group mb-4 font-semibold"
          id="toggle-alt"
          type="button"
          onClick={() => setShowAlternative(!showAlternative)}
        >
          <span className="material-symbols-outlined text-unit">
            {showAlternative ? 'remove_circle' : 'add_circle'}
          </span>
          <span className="text-label-md font-label-md uppercase tracking-wide">
            Suggest an Alternative Product
          </span>
          <span
            className={`material-symbols-outlined arrow transition-transform duration-200 ${
              showAlternative ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>

        {showAlternative && (
          <div className="bento-card rounded-xl p-6 bg-surface-container-lowest shadow-sm animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">
                  Alternative Product Name
                </label>
                <input
                  className="px-3 py-2 border border-border-subtle rounded-lg text-body-md"
                  placeholder="e.g. Premium Hemp Blend"
                  type="text"
                  value={altProduct.name}
                  onChange={(e) => setAltProduct({ ...altProduct, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">Proposed Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-body-sm">
                    ₹
                  </span>
                  <input
                    className="w-full pl-7 pr-3 py-2 border border-border-subtle rounded-lg text-body-md font-medium"
                    step="0.01"
                    type="number"
                    value={altProduct.proposedPrice || ''}
                    onChange={(e) =>
                      setAltProduct({ ...altProduct, proposedPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">Reason / Benefit</label>
                <input
                  className="px-3 py-2 border border-border-subtle rounded-lg text-body-md"
                  placeholder="Better availability, lower price..."
                  type="text"
                  value={altProduct.reason}
                  onChange={(e) => setAltProduct({ ...altProduct, reason: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAlternative(false)}
                className="text-label-md font-label-md text-text-muted hover:text-error transition-colors flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove Alternative
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Additional Notes/Terms */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-12">
        <div className="bento-card rounded-xl p-6 shadow-sm">
          <label className="text-label-md font-label-md text-text-muted uppercase mb-3 block font-semibold">
            General Terms &amp; Conditions
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border-subtle rounded-lg text-body-md resize-none focus:ring-2 focus:ring-primary outline-none"
            placeholder="Enter any standard terms, logistics requirements, or payment preferences..."
            rows={4}
            value={generalTerms}
            onChange={(e) => setGeneralTerms(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col gap-gutter">
          <div className="bento-card rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-body-md font-semibold text-on-surface">Quote Validity</span>
              <span className="text-label-sm font-label-sm text-text-muted">
                How long is this offer guaranteed?
              </span>
            </div>
            <select
              className="px-3 py-2 border border-border-subtle rounded-lg text-body-md bg-surface-container-lowest min-w-[140px] focus:ring-2 focus:ring-primary outline-none"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
            >
              <option value={7}>7 Days</option>
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>
          </div>

          <div className="bento-card rounded-xl p-6 flex items-center gap-4 border-primary/20 bg-primary/5 shadow-sm">
            <span className="material-symbols-outlined text-primary text-3xl">info</span>
            <p className="text-body-sm font-body-sm text-on-surface">
              <strong className="text-primary font-bold">Note:</strong> Sending this quotation will notify the retailer immediately. You can edit this quote until it is accepted.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Actions */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] px-margin-md h-20 flex items-center">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-label-sm font-label-sm text-text-muted">Current Quote Total</span>
            <span className="text-headline-md font-headline-md text-on-surface font-bold">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleSendQuotation(true)}
              className="px-6 py-2.5 rounded-lg border border-outline text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors font-semibold"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSendQuotation(false)}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-md hover:bg-on-primary-fixed-variant transition-all active:scale-95 flex items-center gap-2 font-semibold disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Send Quotation</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Feedback Toast */}
      {feedbackSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[60] animate-in fade-in">
          <span className="material-symbols-outlined text-status-success">check_circle</span>
          <span className="text-label-md font-label-md font-semibold">{feedbackSuccess}</span>
        </div>
      )}
    </div>
  );
};
