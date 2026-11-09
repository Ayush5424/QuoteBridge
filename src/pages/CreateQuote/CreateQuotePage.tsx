import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { ProductItem, QuoteRequest } from '../../types';

interface ProductFormItem {
  id: string;
  name: string;
  quantity: number | '';
  unit: string;
}

export const CreateQuotePage: React.FC = () => {
  const navigate = useNavigate();

  const [supplierName, setSupplierName] = useState('Nexus Global Logistics');
  const [businessName, setBusinessName] = useState('FreshMarket Central');
  const [deliveryLocation, setDeliveryLocation] = useState('Warehouse 4B, Central Logistics Hub, Chicago IL');
  const [requiredByDate, setRequiredByDate] = useState('2023-11-15');
  const [rfqTitle, setRfqTitle] = useState('Bulk Seasonal Supply Order');
  
  const [items, setItems] = useState<ProductFormItem[]>([
    { id: '1', name: 'Organic Tomatoes', quantity: 150, unit: 'kg' },
    { id: '2', name: 'Fuji Apples', quantity: 50, unit: 'kg' },
    { id: '3', name: 'Premium Olive Oil', quantity: 25, unit: 'boxes' },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [createdQuote, setCreatedQuote] = useState<QuoteRequest | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddItem = () => {
    const newItem: ProductFormItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: 'kg',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof ProductFormItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent, method: 'whatsapp' | 'direct') => {
    e.preventDefault();

    // Validation
    const validProducts: ProductItem[] = items
      .filter((i) => i.name.trim() !== '')
      .map((i, index) => ({
        id: `p-${Date.now()}-${index}`,
        name: i.name.trim(),
        quantity: Number(i.quantity) || 1,
        unit: i.unit,
      }));

    if (validProducts.length === 0) {
      alert('Please add at least one product with a name.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newQuote: QuoteRequest = {
      id: `quote-${Date.now()}`,
      rfqNumber: `#RQ-2024-${randomSuffix}`,
      title: rfqTitle || `${businessName} Quotation Request`,
      businessName: businessName || 'FreshMarket Central',
      deliveryLocation: deliveryLocation || 'Main Logistics Depot',
      requiredByDate: requiredByDate || new Date().toISOString().split('T')[0],
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
      priority: 'High Priority',
      details: `Quotation request for ${validProducts.length} items issued by ${businessName} for delivery to ${deliveryLocation}.`,
      products: validProducts,
      responses: [],
    };

    StorageService.saveQuote(newQuote);
    setCreatedQuote(newQuote);

    // Show toast feedback
    setToastMessage('Quote Card created successfully!');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    if (method === 'whatsapp') {
      const shareUrl = `${window.location.origin}/supplier-quote/${newQuote.id}`;
      const text = `Hello ${supplierName}, here is our quotation request (${newQuote.rfqNumber}) for ${businessName}. Please review and submit your pricing directly: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const supplierShareLink = createdQuote ? `${window.location.origin}/supplier-quote/${createdQuote.id}` : '';

  const handleCopyLink = () => {
    if (supplierShareLink) {
      navigator.clipboard.writeText(supplierShareLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-margin-lg mb-20 max-w-container-max mx-auto w-full">
      <div className="max-w-[800px] w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-headline-lg font-headline-lg text-on-surface">New Quote Request</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Fill out the details below to generate a professional quote card for your suppliers.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
          <form className="space-y-8" id="quote-form" onSubmit={(e) => handleSubmit(e, 'whatsapp')}>
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">Supplier Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="Search suppliers..."
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">Business Name</label>
                <input
                  className="w-full px-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. FreshMarket Central"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">Delivery Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    location_on
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="Enter delivery address"
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-text-muted">Required By Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    calendar_today
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    type="date"
                    value={requiredByDate}
                    onChange={(e) => setRequiredByDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-border-subtle"></div>

            {/* Dynamic Product Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-headline-md font-headline-md text-on-surface">Requested Products</h3>
                <span className="text-label-sm font-label-sm text-primary bg-primary/10 px-2 py-1 rounded font-medium">
                  {items.length} Items Listed
                </span>
              </div>

              <div className="space-y-3" id="product-rows">
                {items.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end group">
                    <div className="col-span-6 md:col-span-7 flex flex-col gap-1.5">
                      {idx === 0 && (
                        <label className="text-label-sm font-label-sm text-text-muted">Product Name</label>
                      )}
                      <input
                        className="w-full px-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Organic Tomatoes"
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-span-3 md:col-span-2 flex flex-col gap-1.5">
                      {idx === 0 && (
                        <label className="text-label-sm font-label-sm text-text-muted">Qty</label>
                      )}
                      <input
                        className="w-full px-4 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary outline-none"
                        placeholder="0"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-span-3 md:col-span-2 flex flex-col gap-1.5">
                      {idx === 0 && (
                        <label className="text-label-sm font-label-sm text-text-muted">Unit</label>
                      )}
                      <select
                        className="w-full px-3 py-2 bg-white border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary outline-none"
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      >
                        <option value="kg">kg</option>
                        <option value="units">units</option>
                        <option value="boxes">boxes</option>
                        <option value="m">m</option>
                        <option value="pcs">pcs</option>
                      </select>
                    </div>

                    <div className="col-span-12 md:col-span-1 flex justify-end">
                      <button
                        className="p-2 text-outline hover:text-error transition-colors disabled:opacity-40"
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        title="Delete Item"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="flex items-center gap-2 text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors mt-2 font-medium"
                type="button"
                onClick={handleAddItem}
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span className="text-label-md font-label-md">Add Item</span>
              </button>
            </div>

            {/* Footer Action */}
            <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-status-success"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="text-body-sm font-body-sm">All changes saved automatically</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'direct')}
                  className="w-full sm:w-auto bg-surface-container-high text-on-surface border border-outline-variant px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all text-label-md font-label-md font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save & Open RFQ
                </button>

                <button
                  className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-md font-semibold text-label-md font-label-md"
                  type="submit"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.296-.769.966-.945 1.16-.175.196-.351.222-.653.072-.301-.15-1.273-.47-2.425-1.494-.897-.8-1.502-1.787-1.678-2.087-.175-.3-.02-.462.13-.611.135-.135.301-.351.451-.527.15-.175.2-.301.301-.502.1-.197.05-.37-.025-.521-.075-.15-.673-1.62-.921-2.213-.242-.583-.487-.503-.673-.513-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.803.37-.276.296-1.054 1.028-1.054 2.508 0 1.48 1.079 2.91 1.229 3.11.15.2 2.123 3.24 5.143 4.544.718.311 1.278.497 1.716.637.721.229 1.376.196 1.894.119.578-.085 1.767-.721 2.016-1.417.25-.696.25-1.293.175-1.417-.076-.124-.277-.197-.578-.347zM12 0C5.373 0 0 5.373 0 12c0 2.12.551 4.113 1.517 5.856L0 24l6.304-1.654C7.88 23.285 9.873 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.932c-1.91 0-3.782-.513-5.416-1.484l-.388-.231-3.75 1 1.018-3.66-.254-.403C2.18 15.518 1.6 13.79 1.6 12c0-5.735 4.665-10.4 10.4-10.4 5.735 0 10.4 4.665 10.4 10.4 0 5.735-4.665 10.4-10.4 10.4z" />
                  </svg>
                  <span>Share Quote Card via WhatsApp</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Informational Banner */}
        <div className="mt-8 p-4 bg-surface-container-low border border-border-subtle rounded-xl flex items-start gap-4">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <div>
            <h4 className="text-label-md font-label-md text-on-surface font-semibold">Pro Tip</h4>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Sharing via WhatsApp generates a unique link for the supplier. They can input prices directly without needing a QuoteBridge account.
            </p>
          </div>
        </div>

        {/* Post-Creation Action Modal */}
        {createdQuote && (
          <div className="mt-6 bg-white border-2 border-primary/30 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-status-success font-bold text-headline-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>RFQ Successfully Dispatched ({createdQuote.rfqNumber})</span>
              </div>
              <button
                onClick={() => setCreatedQuote(null)}
                className="text-text-muted hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-body-md text-text-muted mb-4">
              Your quotation request for <strong>{createdQuote.products.length} items</strong> is now active. You can simulate the supplier response right now or return to the dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/supplier-quote/${createdQuote.id}`)}
                className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary-container shadow"
              >
                <span className="material-symbols-outlined text-[18px]">store</span>
                Open Supplier Quote Entry
              </button>

              <button
                onClick={handleCopyLink}
                className="bg-surface-container-high text-on-surface border border-outline-variant px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedLink ? 'done' : 'link'}
                </span>
                {copiedLink ? 'Link Copied!' : 'Copy Supplier Link'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="text-primary hover:underline px-4 py-2.5 text-sm font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Message Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[60] animate-in fade-in slide-in-from-bottom-4"
          id="toast"
        >
          <span className="material-symbols-outlined text-status-success">check_circle</span>
          <span className="text-label-md font-label-md font-semibold">{toastMessage}</span>
        </div>
      )}
    </main>
  );
};
