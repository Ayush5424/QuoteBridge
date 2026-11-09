export type QuoteStatus = 'Draft' | 'Pending' | 'Received' | 'Accepted' | 'Rejected' | 'Expired';

export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specs?: string;
  reference?: string;
}

export interface SupplierOfferItem {
  productId: string;
  available: boolean;
  unitPrice: number;
  estDeliveryDate?: string;
  notes?: string;
}

export interface AlternativeProduct {
  name: string;
  proposedPrice: number;
  reason: string;
}

export interface SupplierResponse {
  id: string;
  quoteId: string;
  supplierId: string;
  supplierName: string;
  supplierTier?: string; // e.g. "Tier 1 Supplier", "Top Rated", "Local Vendor"
  supplierContact?: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  submittedDate: string;
  validityDays: number;
  generalTerms?: string;
  items: SupplierOfferItem[];
  alternativeProduct?: AlternativeProduct;
  totalAmount: number;
  status: 'Pending' | 'Submitted' | 'Accepted' | 'Declined';
  estDeliveryDays?: number;
  shippingRoute?: string;
}

export interface QuoteRequest {
  id: string;
  rfqNumber: string; // e.g. #RQ-2024-0089 or #QB-2024-089
  title: string;
  businessName: string;
  deliveryLocation: string;
  requiredByDate: string;
  createdDate: string;
  status: QuoteStatus;
  priority: 'Normal' | 'High Priority';
  details?: string;
  products: ProductItem[];
  selectedSupplierId?: string;
  selectedResponseId?: string;
  responses: SupplierResponse[];
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #QB-94420-2023
  quoteId: string;
  rfqNumber: string;
  responseId: string;
  supplierName: string;
  supplierContact: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  businessName: string;
  deliveryLocation: string;
  confirmedDate: string;
  expectedDelivery: string;
  shippingRoute: string;
  totalCost: number;
  taxAmount: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    confirmedPrice: number;
  }[];
  totalUnits: number;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
}
