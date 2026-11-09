import { QuoteRequest, Order, SupplierResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface DashboardSummaryData {
  activeRequestsCount: number;
  waitingResponseCount: number;
  quotesReceivedCount: number;
  recentQuotes: QuoteRequest[];
}

export interface ComparisonSummaryData {
  quoteId: string;
  rfqNumber: string;
  title: string;
  businessName: string;
  bestValueSupplier: string;
  bestValueAmount: number;
  savingsAmount: number;
  speedLeaderSupplier: string;
  speedLeaderDays: number;
  lineItemsMatch: string;
  responses: SupplierResponse[];
  lineItems: {
    productId: string;
    productName: string;
    specs?: string;
    quantity: number;
    unit: string;
    supplierPrices: Record<string, number>;
    supplierAvailability: Record<string, boolean>;
    lowestPriceSupplierId?: string;
  }[];
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch {
        // fallback to generic message
      }
      throw new Error(errorMessage);
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  }

  // Dashboard Endpoint
  async getDashboardSummary(): Promise<DashboardSummaryData> {
    return this.request<DashboardSummaryData>('/dashboard/summary');
  }

  // Quotation Requests Endpoints
  async getQuotations(status?: string, search?: string): Promise<QuoteRequest[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<QuoteRequest[]>(`/quotations${qs}`);
  }

  async getQuoteById(id: string): Promise<QuoteRequest> {
    return this.request<QuoteRequest>(`/quotations/${encodeURIComponent(id)}`);
  }

  async createQuotation(quoteData: Partial<QuoteRequest>): Promise<QuoteRequest> {
    return this.request<QuoteRequest>('/quotations', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  }

  async selectResponse(quoteId: string, responseId: string): Promise<QuoteRequest> {
    return this.request<QuoteRequest>(`/quotations/${encodeURIComponent(quoteId)}/select-response`, {
      method: 'POST',
      body: JSON.stringify({ responseId }),
    });
  }

  async updateQuoteStatus(quoteId: string, status: string): Promise<QuoteRequest> {
    return this.request<QuoteRequest>(`/quotations/${encodeURIComponent(quoteId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Supplier Quotation Responses
  async submitSupplierResponse(quoteId: string, responseData: Partial<SupplierResponse>): Promise<SupplierResponse> {
    return this.request<SupplierResponse>(`/quotations/${encodeURIComponent(quoteId)}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  async getResponsesForQuotation(quoteId: string): Promise<SupplierResponse[]> {
    return this.request<SupplierResponse[]>(`/quotations/${encodeURIComponent(quoteId)}/responses`);
  }

  // Comparison Matrix & Metrics
  async getComparisonSummary(quoteId: string): Promise<ComparisonSummaryData> {
    return this.request<ComparisonSummaryData>(`/quotations/${encodeURIComponent(quoteId)}/comparison`);
  }

  // Order Endpoints
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this.request<Order>(`/orders/${encodeURIComponent(orderId)}`);
  }

  async getOrderByQuoteId(quoteId: string): Promise<Order> {
    return this.request<Order>(`/orders/by-quote/${encodeURIComponent(quoteId)}`);
  }

  async getOrders(status?: string): Promise<Order[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<Order[]>(`/orders${qs}`);
  }

  // Suppliers Endpoint
  async getSuppliers(): Promise<{ id: string; organizationName: string; supplierTier: string; contactName: string; contactRole: string; contactEmail: string; contactPhone: string }[]> {
    return this.request('/suppliers');
  }
}

export const api = new ApiService();
