import { QuoteRequest, Order, SupplierResponse } from '../types';

const QUOTES_STORAGE_KEY = 'quotebridge_quotes_v1';
const ORDERS_STORAGE_KEY = 'quotebridge_orders_v1';

export const initialQuotes: QuoteRequest[] = [
  {
    id: 'quote-1',
    rfqNumber: '#RQ-2024-0089',
    title: 'Industrial Hardware & Logistics',
    businessName: 'Urban Retail Co.',
    deliveryLocation: 'Warehouse 4B, Central Logistics Hub, Chicago IL',
    requiredByDate: '2023-10-28',
    createdDate: 'Oct 24, 2023',
    status: 'Received',
    priority: 'High Priority',
    details: 'We are looking for industrial hub assemblies and specialized coating services for our upcoming Q4 rollout. Firm delivery timelines required.',
    products: [
      { id: 'p1', name: 'Industrial Hub Assembly - V4', quantity: 200, unit: 'units', reference: 'HA-409' },
      { id: 'p2', name: 'Specialized Coating Service', quantity: 1, unit: 'units', reference: 'SCS-01' },
      { id: 'p3', name: 'Expedited Shipping & Handling', quantity: 1, unit: 'units', reference: 'ESH-99' },
    ],
    selectedSupplierId: 'sup-nexus',
    selectedResponseId: 'resp-nexus-1',
    responses: [
      {
        id: 'resp-nexus-1',
        quoteId: 'quote-1',
        supplierId: 'sup-nexus',
        supplierName: 'Nexus Global Logistics',
        supplierTier: 'Verified Enterprise Partner',
        supplierContact: {
          name: 'Sarah Jenkins',
          role: 'Account Manager',
          email: 's.jenkins@nexusglobal.com',
          phone: '+1 (555) 902-1144',
        },
        submittedDate: 'Oct 24, 2023',
        validityDays: 15,
        generalTerms: 'FOB Destination. Net 30 payment terms. Includes standard cargo insurance coverage.',
        shippingRoute: 'Shanghai → Los Angeles',
        estDeliveryDays: 4,
        totalAmount: 12450.00,
        status: 'Accepted',
        items: [
          { productId: 'p1', available: true, unitPrice: 45.00, estDeliveryDate: '2023-10-24', notes: 'In stock at central warehouse' },
          { productId: 'p2', available: true, unitPrice: 1250.00, estDeliveryDate: '2023-10-24', notes: 'Certified military grade finish' },
          { productId: 'p3', available: true, unitPrice: 2200.00, estDeliveryDate: '2023-10-24', notes: 'Air express tier' },
        ],
      },
    ],
  },
  {
    id: 'quote-2',
    rfqNumber: '#RQ-2024-0092',
    title: 'Workstation Tech & Peripherals',
    businessName: 'FreshMarket Central Tech Hub',
    deliveryLocation: 'Building 7, Suite 300, Austin TX',
    requiredByDate: '2023-11-02',
    createdDate: 'Oct 25, 2023',
    status: 'Pending',
    priority: 'Normal',
    details: 'Procurement of office displays, mechanical peripherals, high speed hubs, and cables for engineer workstations.',
    products: [
      { id: 'p4', name: 'Dell 27" 4K Monitor', quantity: 5, unit: 'units', specs: 'U2723QE - Black' },
      { id: 'p5', name: 'Mechanical Keyboard', quantity: 10, unit: 'units', specs: 'Logitech MX Mechanical' },
      { id: 'p6', name: 'USB-C Hub (11-in-1)', quantity: 12, unit: 'units', specs: 'Anker PowerExpand' },
      { id: 'p7', name: 'Thunderbolt 4 Cable', quantity: 20, unit: 'units', specs: '2m Active Cable' },
    ],
    responses: [
      {
        id: 'resp-comp-a',
        quoteId: 'quote-2',
        supplierId: 'sup-a',
        supplierName: 'Global Tech Corp',
        supplierTier: 'Tier 1 Supplier',
        supplierContact: {
          name: 'Robert Miller',
          role: 'Corporate Sales Lead',
          email: 'sales@globaltechcorp.com',
          phone: '+1 (555) 321-4455',
        },
        submittedDate: 'Oct 26, 2023',
        validityDays: 30,
        generalTerms: 'Standard enterprise warranty. 2% discount on net 10.',
        shippingRoute: 'Dallas → Austin',
        estDeliveryDays: 5,
        totalAmount: 45800,
        status: 'Submitted',
        items: [
          { productId: 'p4', available: true, unitPrice: 5200 },
          { productId: 'p5', available: true, unitPrice: 1200 },
          { productId: 'p6', available: true, unitPrice: 850 },
          { productId: 'p7', available: true, unitPrice: 450 },
        ],
      },
      {
        id: 'resp-comp-b',
        quoteId: 'quote-2',
        supplierId: 'sup-b',
        supplierName: 'Swift Logistics',
        supplierTier: 'Top Rated',
        supplierContact: {
          name: 'Elena Rostova',
          role: 'Key Account Executive',
          email: 'elena@swiftlogistics.io',
          phone: '+1 (555) 778-9900',
        },
        submittedDate: 'Oct 26, 2023',
        validityDays: 15,
        generalTerms: 'Best volume pricing guaranteed for 15 days.',
        shippingRoute: 'Houston → Austin',
        estDeliveryDays: 4,
        totalAmount: 43450,
        status: 'Submitted',
        items: [
          { productId: 'p4', available: true, unitPrice: 4800 },
          { productId: 'p5', available: true, unitPrice: 1150 },
          { productId: 'p6', available: true, unitPrice: 900 },
          { productId: 'p7', available: true, unitPrice: 420 },
        ],
      },
      {
        id: 'resp-comp-c',
        quoteId: 'quote-2',
        supplierId: 'sup-c',
        supplierName: 'Metro Supplies',
        supplierTier: 'Local Vendor',
        supplierContact: {
          name: 'David Vance',
          role: 'Operations Dispatch',
          email: 'dvance@metrosupplies.com',
          phone: '+1 (555) 441-2299',
        },
        submittedDate: 'Oct 27, 2023',
        validityDays: 7,
        generalTerms: 'Same day dispatch available if confirmed before 2 PM.',
        shippingRoute: 'Local Depot → Austin',
        estDeliveryDays: 2,
        totalAmount: 46200,
        status: 'Submitted',
        items: [
          { productId: 'p4', available: true, unitPrice: 5100 },
          { productId: 'p5', available: true, unitPrice: 1100 },
          { productId: 'p6', available: false, unitPrice: 0, notes: 'Currently out of stock' },
          { productId: 'p7', available: true, unitPrice: 480 },
        ],
      },
    ],
  },
  {
    id: 'quote-3',
    rfqNumber: '#RQ-2024-0104',
    title: 'Cold Storage Freight Dispatch',
    businessName: 'FreshMarket Central',
    deliveryLocation: 'Distribution Center 9, Seattle WA',
    requiredByDate: '2023-10-29',
    createdDate: 'Oct 26, 2023',
    status: 'Pending',
    priority: 'High Priority',
    details: 'Temperature controlled refrigerated container transport.',
    products: [
      { id: 'p8', name: 'Refrigerated Reefer Containers', quantity: 4, unit: 'units' },
      { id: 'p9', name: 'IoT Temp Monitoring Modules', quantity: 8, unit: 'units' },
    ],
    responses: [],
  },
  {
    id: 'quote-4',
    rfqNumber: '#QB-2024-089',
    title: 'Cloud Infrastructure Expansion',
    businessName: 'Apex Data Corp',
    deliveryLocation: 'Primary Cloud Datacenter, Ashburn VA',
    requiredByDate: '2023-10-20',
    createdDate: 'Oct 12, 2023',
    status: 'Accepted',
    priority: 'Normal',
    products: [
      { id: 'p10', name: 'High-Throughput Rack Switch 100G', quantity: 4, unit: 'units' },
    ],
    selectedSupplierId: 'sup-azure',
    selectedResponseId: 'resp-azure-1',
    responses: [
      {
        id: 'resp-azure-1',
        quoteId: 'quote-4',
        supplierId: 'sup-azure',
        supplierName: 'Azure Systems Inc.',
        supplierTier: 'Tier 1 Supplier',
        supplierContact: {
          name: 'Marcus Brody',
          role: 'Enterprise Architect',
          email: 'marcus@azuresystems.com',
          phone: '+1 (555) 880-9911',
        },
        submittedDate: 'Oct 13, 2023',
        validityDays: 30,
        totalAmount: 42500.00,
        status: 'Accepted',
        items: [
          { productId: 'p10', available: true, unitPrice: 10625.00 },
        ],
      },
    ],
  },
  {
    id: 'quote-5',
    rfqNumber: '#QB-2024-088',
    title: 'Security Audit Services',
    businessName: 'FreshMarket HQ',
    deliveryLocation: 'Remote & On-Site Security Assessment',
    requiredByDate: '2023-10-15',
    createdDate: 'Oct 10, 2023',
    status: 'Rejected',
    priority: 'Normal',
    products: [
      { id: 'p11', name: 'Penetration Testing & Red Teaming', quantity: 1, unit: 'units' },
    ],
    responses: [
      {
        id: 'resp-cyber-1',
        quoteId: 'quote-5',
        supplierId: 'sup-cyber',
        supplierName: 'CyberGuard Solutions',
        supplierTier: 'Security Specialist',
        submittedDate: 'Oct 11, 2023',
        validityDays: 14,
        totalAmount: 18200.00,
        status: 'Declined',
        items: [
          { productId: 'p11', available: true, unitPrice: 18200.00 },
        ],
      },
    ],
  },
  {
    id: 'quote-6',
    rfqNumber: '#QB-2024-085',
    title: 'Bulk Hardware Procurement',
    businessName: 'FreshMarket Retail Network',
    deliveryLocation: 'Central Fulfillment Facility, Denver CO',
    requiredByDate: '2023-10-05',
    createdDate: 'Sep 28, 2023',
    status: 'Expired',
    priority: 'Normal',
    products: [
      { id: 'p12', name: 'Enterprise Point-of-Sale Terminals', quantity: 50, unit: 'units' },
    ],
    responses: [
      {
        id: 'resp-global-tech',
        quoteId: 'quote-6',
        supplierId: 'sup-global-tech',
        supplierName: 'Global Tech Supply',
        submittedDate: 'Sep 29, 2023',
        validityDays: 7,
        totalAmount: 125000.00,
        status: 'Declined',
        items: [
          { productId: 'p12', available: true, unitPrice: 2500.00 },
        ],
      },
    ],
  },
  {
    id: 'quote-7',
    rfqNumber: '#QB-2024-082',
    title: 'Office Remodeling Phase 1',
    businessName: 'Urban Retail Co.',
    deliveryLocation: 'Corporate HQ, Floor 4, Boston MA',
    requiredByDate: '2023-09-25',
    createdDate: 'Sep 15, 2023',
    status: 'Accepted',
    priority: 'Normal',
    products: [
      { id: 'p13', name: 'Acoustic Partition Panels', quantity: 24, unit: 'units' },
    ],
    selectedSupplierId: 'sup-swift-build',
    selectedResponseId: 'resp-swift-build-1',
    responses: [
      {
        id: 'resp-swift-build-1',
        quoteId: 'quote-7',
        supplierId: 'sup-swift-build',
        supplierName: 'Swift Build Co.',
        submittedDate: 'Sep 16, 2023',
        validityDays: 30,
        totalAmount: 8450.00,
        status: 'Accepted',
        items: [
          { productId: 'p13', available: true, unitPrice: 352.08 },
        ],
      },
    ],
  },
  {
    id: 'quote-8',
    rfqNumber: '#QB-2024-079',
    title: 'Custom Software Module',
    businessName: 'Urban Retail Co.',
    deliveryLocation: 'Digital Delivery / GitHub Enterprise',
    requiredByDate: '2023-09-01',
    createdDate: 'Aug 22, 2023',
    status: 'Pending',
    priority: 'Normal',
    products: [
      { id: 'p14', name: 'Real-Time Inventory Sync Middleware', quantity: 1, unit: 'units' },
    ],
    responses: [
      {
        id: 'resp-devforce',
        quoteId: 'quote-8',
        supplierId: 'sup-devforce',
        supplierName: 'DevForce Labs',
        submittedDate: 'Aug 24, 2023',
        validityDays: 30,
        totalAmount: 12000.00,
        status: 'Pending',
        items: [
          { productId: 'p14', available: true, unitPrice: 12000.00 },
        ],
      },
    ],
  },
];

export const initialOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: '#QB-94420-2023',
    quoteId: 'quote-1',
    rfqNumber: '#RQ-2024-0089',
    responseId: 'resp-nexus-1',
    supplierName: 'Nexus Global Logistics',
    supplierContact: {
      name: 'Sarah Jenkins',
      role: 'Account Manager',
      email: 's.jenkins@nexusglobal.com',
      phone: '+1 (555) 902-1144',
    },
    businessName: 'Urban Retail Co.',
    deliveryLocation: 'Warehouse 4B, Central Logistics Hub, Chicago IL',
    confirmedDate: 'Oct 24, 2023',
    expectedDelivery: 'Oct 24, 2023',
    shippingRoute: 'Shanghai → Los Angeles',
    totalCost: 12450.00,
    taxAmount: 1494.00,
    totalUnits: 202,
    status: 'Confirmed',
    items: [
      {
        description: 'Industrial Hub Assembly - V4',
        quantity: 200,
        unitPrice: 45.00,
        confirmedPrice: 9000.00,
      },
      {
        description: 'Specialized Coating Service',
        quantity: 1,
        unitPrice: 1250.00,
        confirmedPrice: 1250.00,
      },
      {
        description: 'Expedited Shipping & Handling',
        quantity: 1,
        unitPrice: 2200.00,
        confirmedPrice: 2200.00,
      },
    ],
  },
];

export const StorageService = {
  getQuotes(): QuoteRequest[] {
    try {
      const data = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(initialQuotes));
        return initialQuotes;
      }
      return JSON.parse(data);
    } catch {
      return initialQuotes;
    }
  },

  getQuoteById(id: string): QuoteRequest | undefined {
    const quotes = this.getQuotes();
    return quotes.find((q) => q.id === id || q.rfqNumber === id);
  },

  saveQuote(quote: QuoteRequest): QuoteRequest {
    const quotes = this.getQuotes();
    const existingIndex = quotes.findIndex((q) => q.id === quote.id);
    if (existingIndex >= 0) {
      quotes[existingIndex] = quote;
    } else {
      quotes.unshift(quote);
    }
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
    return quote;
  },

  updateQuoteStatus(id: string, status: QuoteRequest['status']): QuoteRequest | undefined {
    const quotes = this.getQuotes();
    const quote = quotes.find((q) => q.id === id);
    if (quote) {
      quote.status = status;
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
    }
    return quote;
  },

  addSupplierResponse(quoteId: string, response: SupplierResponse): QuoteRequest | undefined {
    const quotes = this.getQuotes();
    const quote = quotes.find((q) => q.id === quoteId);
    if (quote) {
      const existingRespIndex = quote.responses.findIndex((r) => r.id === response.id || r.supplierId === response.supplierId);
      if (existingRespIndex >= 0) {
        quote.responses[existingRespIndex] = response;
      } else {
        quote.responses.push(response);
      }
      // If quote was pending and now has responses, mark status as Received
      if (quote.status === 'Pending' || quote.status === 'Draft') {
        quote.status = 'Received';
      }
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
    }
    return quote;
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
        return initialOrders;
      }
      return JSON.parse(data);
    } catch {
      return initialOrders;
    }
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id);
  },

  getOrderByQuoteId(quoteId: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.quoteId === quoteId);
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    // Prevent duplicate orders
    const existing = orders.find((o) => o.quoteId === order.quoteId && o.responseId === order.responseId);
    if (existing) {
      return existing;
    }
    orders.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    // Update quote status to Accepted
    this.updateQuoteStatus(order.quoteId, 'Accepted');
    return order;
  },

  resetDefaults(): void {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(initialQuotes));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
  },
};
