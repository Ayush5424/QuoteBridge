import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { QuoteRequest, Order, SupplierResponse } from '../../types';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const quoteIdParam = searchParams.get('quoteId');
  const responseIdParam = searchParams.get('responseId');

  const [order, setOrder] = useState<Order | null>(null);
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [response, setResponse] = useState<SupplierResponse | null>(null);

  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmedSuccess, setIsConfirmedSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);

  useEffect(() => {
    // 1. Try to load an existing order by ID or Quote ID
    if (id) {
      const existingOrder = StorageService.getOrderById(id);
      if (existingOrder) {
        setOrder(existingOrder);
        setIsConfirmedSuccess(true);
        const relatedQuote = StorageService.getQuoteById(existingOrder.quoteId);
        if (relatedQuote) setQuote(relatedQuote);
        return;
      }
    }

    // 2. Load quote from param or existing order
    const quotes = StorageService.getQuotes();
    const targetQuoteId = quoteIdParam || id || 'quote-1';
    const targetQuote = quotes.find((q) => q.id === targetQuoteId || q.rfqNumber === targetQuoteId) || quotes[0];

    if (targetQuote) {
      setQuote(targetQuote);

      // Check if an order already exists for this quote
      const existingOrder = StorageService.getOrderByQuoteId(targetQuote.id);
      if (existingOrder) {
        setOrder(existingOrder);
        setIsConfirmedSuccess(true);
      }

      // Determine the supplier response
      let targetResp: SupplierResponse | undefined;
      if (responseIdParam) {
        targetResp = targetQuote.responses.find((r) => r.id === responseIdParam);
      }
      if (!targetResp && targetQuote.selectedResponseId) {
        targetResp = targetQuote.responses.find((r) => r.id === targetQuote.selectedResponseId);
      }
      if (!targetResp && targetQuote.responses.length > 0) {
        targetResp = targetQuote.responses[0];
      }
      if (targetResp) {
        setResponse(targetResp);
      }
    }
  }, [id, quoteIdParam, responseIdParam]);

  if (!quote && !order) {
    return (
      <div className="max-w-container-max mx-auto px-margin-md py-12 text-center">
        <h2 className="text-headline-lg font-bold">Quotation Order Not Found</h2>
        <p className="text-body-md text-text-muted mt-2">Could not locate active order records.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Derive display values from either the confirmed order or selected response/quote
  const supplierName = order?.supplierName || response?.supplierName || 'Nexus Global Logistics';
  const supplierTier = response?.supplierTier || 'Verified Enterprise Partner';
  const supplierContact = order?.supplierContact || response?.supplierContact || {
    name: 'Sarah Jenkins',
    role: 'Account Manager',
    email: 's.jenkins@nexusglobal.com',
    phone: '+1 (555) 902-1144',
  };

  const shippingRoute = order?.shippingRoute || response?.shippingRoute || 'Shanghai → Los Angeles';
  const expectedDelivery = order?.expectedDelivery || quote?.requiredByDate || 'Oct 24, 2023';

  // Items to display
  const items = order
    ? order.items
    : quote
    ? quote.products.map((p) => {
        const itemResp = response?.items?.find((i) => i.productId === p.id);
        const unitPrice = itemResp ? itemResp.unitPrice : 45.0;
        return {
          description: p.name,
          quantity: p.quantity,
          unitPrice,
          confirmedPrice: p.quantity * unitPrice,
        };
      })
    : [];

  const subtotal = order ? order.totalCost : items.reduce((acc, curr) => acc + curr.confirmedPrice, 0);
  const taxEstimate = order ? order.taxAmount : subtotal * 0.12;
  const totalUnits = order ? order.totalUnits : items.reduce((acc, curr) => acc + curr.quantity, 0);
  const transactionId = order?.orderNumber || '#QB-94420-2023';

  // Order Confirmation Action
  const handleConfirmOrder = () => {
    if (order && isConfirmedSuccess) return;

    setIsConfirming(true);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `#QB-${randomSuffix}-2024`,
      quoteId: quote!.id,
      rfqNumber: quote!.rfqNumber,
      responseId: response?.id || 'resp-default',
      supplierName,
      supplierContact,
      businessName: quote!.businessName,
      deliveryLocation: quote!.deliveryLocation,
      confirmedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      expectedDelivery,
      shippingRoute,
      totalCost: subtotal,
      taxAmount: taxEstimate,
      totalUnits,
      status: 'Confirmed',
      items,
    };

    setTimeout(() => {
      const saved = StorageService.createOrder(newOrder);
      setOrder(saved);
      setIsConfirming(false);
      setIsConfirmedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatSent(true);
    setTimeout(() => {
      setChatSent(false);
      setChatMessage('');
      setShowChatModal(false);
      alert(`Message successfully sent to ${supplierContact.name} (${supplierName}).`);
    }, 1000);
  };

  return (
    <main className="max-w-container-max mx-auto px-margin-md py-10 pb-24">
      {/* Success State Header */}
      <div className="mb-12 text-center animate-in fade-in duration-700 slide-in-from-top-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-status-success/10 text-status-success mb-4">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <h2 className="font-display text-display text-on-surface">
          {isConfirmedSuccess ? 'Order Confirmed & Purchase Order Issued' : 'Quotation Accepted'}
        </h2>
        <p className="text-body-lg font-body-lg text-text-muted mt-2">
          {isConfirmedSuccess
            ? `Purchase Order ${order?.orderNumber} is locked and transmitted to ${supplierName}.`
            : `Ready to finalize your agreement with ${supplierName}.`}
        </p>
      </div>

      {/* Bento Grid Confirmation Layout */}
      <div className="bento-grid">
        {/* Summary Card (Level 1) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-surface-subtle gap-4">
            <div>
              <h3 className="font-headline-lg text-headline-lg font-bold mb-1 text-on-surface">
                Order Summary
              </h3>
              <p className="text-body-md font-body-md text-text-muted">
                Transaction ID: {transactionId}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-label-md font-label-md text-text-muted uppercase tracking-wider mb-1 font-semibold">
                Total Confirmed Cost
              </p>
              <p className="text-display font-display text-primary font-bold">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Confirmed Items Table */}
          <div className="overflow-hidden border border-border-subtle rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-subtle">
                <tr>
                  <th className="px-4 py-3 text-label-sm font-label-sm text-text-muted uppercase font-semibold">
                    Item Description
                  </th>
                  <th className="px-4 py-3 text-label-sm font-label-sm text-text-muted uppercase text-center font-semibold">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-label-sm font-label-sm text-text-muted uppercase text-right font-semibold">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-label-sm font-label-sm text-text-muted uppercase text-right font-semibold">
                    Confirmed Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-subtle">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                    <td className="px-4 py-4 font-body-md text-on-surface font-medium">
                      {item.description}
                    </td>
                    <td className="px-4 py-4 font-body-md text-center text-text-muted font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 font-body-md text-right text-text-muted">
                      ₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4 font-body-md text-right font-semibold text-on-surface">
                      ₹{item.confirmedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-surface-subtle rounded-lg border border-border-subtle">
              <p className="text-label-sm font-label-sm text-text-muted uppercase mb-1 font-semibold">
                Total Items
              </p>
              <p className="text-headline-md font-headline-md font-bold text-on-surface">
                {totalUnits} Units
              </p>
            </div>
            <div className="p-4 bg-surface-subtle rounded-lg border border-border-subtle">
              <p className="text-label-sm font-label-sm text-text-muted uppercase mb-1 font-semibold">
                Expected Delivery
              </p>
              <p className="text-headline-md font-headline-md font-bold text-on-surface">
                {expectedDelivery}
              </p>
            </div>
            <div className="p-4 bg-surface-subtle rounded-lg border border-border-subtle">
              <p className="text-label-sm font-label-sm text-text-muted uppercase mb-1 font-semibold">
                Tax Estimate (12%)
              </p>
              <p className="text-headline-md font-headline-md font-bold text-on-surface">
                ₹{taxEstimate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Side Cards (Supplier & Actions) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Supplier Info Card */}
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-label-md font-label-md text-text-muted uppercase mb-4 font-bold tracking-wider">
              Supplier Contact
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">business</span>
              </div>
              <div>
                <p className="font-headline-md text-headline-md font-bold text-on-surface">
                  {supplierName}
                </p>
                <p className="text-body-sm font-body-sm text-text-muted">{supplierTier}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-text-muted text-sm" style={{ fontSize: '18px' }}>
                  account_circle
                </span>
                <div>
                  <p className="text-label-md font-label-md font-semibold">{supplierContact.name}</p>
                  <p className="text-body-sm font-body-sm text-text-muted">{supplierContact.role}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-text-muted text-sm" style={{ fontSize: '18px' }}>
                  mail
                </span>
                <p className="text-body-sm font-body-sm text-on-surface">{supplierContact.email}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-text-muted text-sm" style={{ fontSize: '18px' }}>
                  call
                </span>
                <p className="text-body-sm font-body-sm text-on-surface">{supplierContact.phone}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-subtle">
              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md font-semibold"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>
                  chat
                </span>
                Message Supplier
              </button>
            </div>
          </div>

          {/* Final Action Card */}
          <div className="bg-white border-2 border-primary/20 rounded-xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                {isConfirmedSuccess ? 'Status: Confirmed' : 'Final Step'}
              </span>
            </div>

            <p className="text-body-md font-body-md text-on-surface mb-6">
              {isConfirmedSuccess
                ? 'Your Purchase Order is verified and actively being dispatched by the supplier. You can monitor milestone progress in Quote History.'
                : 'By clicking confirm, you authorize the generation of a Purchase Order and initiate the contract signing workflow.'}
            </p>

            {isConfirmedSuccess ? (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/history')}
                  className="w-full bg-status-success text-white py-3.5 rounded-lg font-headline-md text-headline-md font-bold shadow-md hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">history</span>
                  View in Quote History
                </button>
                <Link
                  to="/"
                  className="w-full block text-center border border-border-subtle py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-subtle transition-colors text-text-primary"
                >
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  id="confirmBtn"
                  disabled={isConfirming}
                  onClick={handleConfirmOrder}
                  className="w-full bg-primary text-white py-4 rounded-lg font-headline-md text-headline-md hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mb-4 flex items-center justify-center gap-3 font-bold disabled:opacity-75"
                >
                  {isConfirming ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Order</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="w-full text-text-muted py-2 text-label-md font-label-md hover:text-on-surface transition-colors font-semibold"
                >
                  Review Terms &amp; Conditions
                </button>
              </>
            )}
          </div>

          {/* Visual Asset / Image Slot */}
          <div className="rounded-xl overflow-hidden h-40 border border-border-subtle relative shadow-sm">
            <img
              className="w-full h-full object-cover grayscale opacity-80"
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80"
              alt="Cargo Logistics Port"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-label-sm font-label-sm text-text-muted uppercase font-semibold">
                Shipping Route
              </p>
              <p className="text-body-md font-body-md font-bold text-on-surface">{shippingRoute}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border-subtle">
            <h3 className="text-headline-md font-bold text-on-surface mb-3">
              Purchase Terms &amp; Conditions
            </h3>
            <div className="space-y-3 text-body-sm text-on-surface-variant max-h-60 overflow-y-auto p-3 bg-surface-subtle rounded-xl border border-border-subtle">
              <p><strong>1. Delivery:</strong> FOB Destination, standard maritime or multimodal freight.</p>
              <p><strong>2. Payment:</strong> Net 30 from bill of lading delivery date, unless otherwise specified in RFQ terms.</p>
              <p><strong>3. Warranty:</strong> Standard manufacturer 12-month defect warranty covering parts and labor.</p>
              <p><strong>4. Inspection:</strong> Goods subject to receiving inspection within 7 business days of delivery.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Supplier Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleSendMessage} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat</span>
                <h3 className="text-headline-md font-bold">Message {supplierName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="text-text-muted hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <textarea
              className="w-full p-3 border border-border-subtle rounded-xl text-body-md focus:ring-2 focus:ring-primary outline-none mb-4"
              rows={4}
              placeholder="Type your inquiry or logistics instructions..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="px-4 py-2 border border-border-subtle rounded-lg text-sm font-medium text-text-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={chatSent}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-container"
              >
                {chatSent ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
