# QuoteBridge – B2B Quotation Management Platform

QuoteBridge is a high-density, professional B2B quotation and procurement management platform built from scratch to faithfully reproduce the authoritative Google Stitch design specifications.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended, tested on v22.15.1)
- npm (v9+ recommended, tested on v10.9.2)

### 1. Installation
Install all dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
To generate the optimized production bundle:
```bash
npm run build
```
The output will be created inside the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Run Automated Tests
```bash
npm test
```

---

## 🛠 Technology Stack

- **Framework:** React 19 (TypeScript)
- **Bundler & Build Tool:** Vite
- **Styling:** Tailwind CSS v3 with exact Google Stitch design system tokens (`DESIGN.md`)
- **Typography:** Inter (`@fontsource/inter` / Google Fonts) & Material Symbols Outlined
- **Routing:** React Router DOM (v7)
- **Icons:** Material Symbols Outlined & Lucide React
- **Data Persistence:** LocalStorage (`localStorage`) with sample seed data and complete CRUD operations

---

## 📱 Application Screens & Routes

| Route | Screen Name | Description & Key Features |
|---|---|---|
| `/` or `/dashboard` | **Home Dashboard** | Key metrics (Active Requests, Waiting Response, Quotes Received), live recent quote cards with status pills, "Need a new quote?" blue action card with handshake watermark, Market Trends analytics modal, and mobile navigation. |
| `/create-quote` | **Create Quote Card** | Basic information form (Supplier search, Business Name, Delivery Location, Required Date), dynamic product line items with add/delete controls, automatic draft saving indicator, and "Share Quote Card via WhatsApp" action with direct supplier link generator. |
| `/supplier-quote/:id?` | **Supplier Quote View** | Supplier-facing pricing interface: RFQ overview banner, request details, line-item price & availability grid with unit prices and delivery dates, collapsible "Suggest an Alternative Product" module, terms & validity selection, live calculation of quote total, and "Send Quotation" workflow. |
| `/compare/:id?` | **Quote Comparison** | Multi-vendor analysis: USP highlight cards ("Best Value", "Speed Leader", "Inventory Match"), horizontal supplier cards with "BEST PRICE" & "FASTEST" badges, Line Item Analysis comparative table with color-coded lowest prices, CSV export, and "Accept Supplier" action. |
| `/order-confirmation/:id?` | **Order Confirmation** | Quotation accepted view: Order summary with transaction ID, confirmed line items table, statistics footer (Total items, Expected delivery, 12% tax estimate), verified supplier contact card with messaging modal, terms review modal, visual shipping route card, and "Confirm Order" action that generates purchase orders and locks quotation status. |
| `/history` | **Quote History** | Comprehensive audit trail: Live search by RFQ number or supplier, filter pills (All, Accepted, Pending, Rejected, Expired), status pills, CSV data exporter, contextual action dropdowns, and pagination. |
| `/supply-chain` | **Supply Chain Reference** | Dedicated route mapped to the primary supply chain dashboard export. |

---

## 🔄 End-to-End Quotation-to-Order Journey

1. **Dashboard Overview:** Alex reviews current active RFQs and supplier quotes.
2. **RFQ Dispatch:** User opens `/create-quote`, inputs products, and creates an RFQ (e.g., `#RQ-2024-XXXX`).
3. **Supplier Pricing:** External supplier opens `/supplier-quote/:id`, provides unit prices, flags item availability, suggests alternatives, and submits the quotation.
4. **Quotation Comparison:** Buyer opens `/compare?quoteId=:id`, reviews side-by-side offers, verifies savings and delivery speeds, and clicks **Accept Supplier**.
5. **Order Confirmation:** Buyer reviews purchase terms, line items, and confirmed totals, then clicks **Confirm Order** to issue a binding Purchase Order.
6. **History & Dashboard Sync:** Status immediately updates across the system to `Accepted` / `Confirmed`, and real-time dashboard counts adjust automatically.

---

## 🧪 Testing Verification

Automated integration tests verify:
- Persistent quote creation with unique identifiers.
- Supplier response association and quote status updates.
- Comparative calculations (best price, fastest speed, net savings).
- Purchase order issuance and duplicate order prevention.
- History filtering and live search.

Run the test suite with:
```bash
npm test
```
