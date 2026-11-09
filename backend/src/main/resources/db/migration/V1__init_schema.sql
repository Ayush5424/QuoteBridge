-- V1__init_schema.sql
-- QuoteBridge Relational Schema

CREATE TABLE organizations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- BUYER, SUPPLIER
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- BUYER, SUPPLIER, ADMIN
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organization_memberships (
    id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_org VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_org_user UNIQUE (organization_id, user_id)
);

CREATE TABLE suppliers (
    id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL,
    supplier_tier VARCHAR(100),
    contact_name VARCHAR(255),
    contact_role VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    specs TEXT,
    unit VARCHAR(50) NOT NULL DEFAULT 'units'
);

CREATE TABLE quotation_requests (
    id VARCHAR(50) PRIMARY KEY,
    rfq_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    buyer_organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    delivery_location TEXT NOT NULL,
    required_by_date VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Normal',
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    selected_supplier_id VARCHAR(50),
    selected_response_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotation_items (
    id VARCHAR(50) PRIMARY KEY,
    quotation_request_id VARCHAR(50) NOT NULL REFERENCES quotation_requests(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity NUMERIC(15,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    specs TEXT,
    reference VARCHAR(100)
);

CREATE TABLE quotation_suppliers (
    id VARCHAR(50) PRIMARY KEY,
    quotation_request_id VARCHAR(50) NOT NULL REFERENCES quotation_requests(id) ON DELETE CASCADE,
    supplier_id VARCHAR(50) NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'INVITED'
);

CREATE TABLE supplier_quotations (
    id VARCHAR(50) PRIMARY KEY,
    quotation_request_id VARCHAR(50) NOT NULL REFERENCES quotation_requests(id) ON DELETE CASCADE,
    supplier_id VARCHAR(50) REFERENCES suppliers(id) ON DELETE SET NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_tier VARCHAR(100),
    contact_name VARCHAR(255),
    contact_role VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    validity_days INT NOT NULL DEFAULT 15,
    general_terms TEXT,
    shipping_route VARCHAR(255),
    est_delivery_days INT,
    total_amount NUMERIC(15,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_quotation_items (
    id VARCHAR(50) PRIMARY KEY,
    supplier_quotation_id VARCHAR(50) NOT NULL REFERENCES supplier_quotations(id) ON DELETE CASCADE,
    product_id VARCHAR(50),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    unit_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    est_delivery_date VARCHAR(50),
    notes TEXT
);

CREATE TABLE alternative_product_proposals (
    id VARCHAR(50) PRIMARY KEY,
    supplier_quotation_id VARCHAR(50) NOT NULL REFERENCES supplier_quotations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    proposed_price NUMERIC(15,2) NOT NULL,
    reason TEXT
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    quotation_request_id VARCHAR(50) NOT NULL REFERENCES quotation_requests(id),
    supplier_quotation_id VARCHAR(50) NOT NULL REFERENCES supplier_quotations(id),
    buyer_organization_id VARCHAR(50) REFERENCES organizations(id),
    supplier_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_role VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    business_name VARCHAR(255) NOT NULL,
    delivery_location TEXT NOT NULL,
    confirmed_date VARCHAR(50) NOT NULL,
    expected_delivery VARCHAR(50) NOT NULL,
    shipping_route VARCHAR(255),
    total_cost NUMERIC(15,2) NOT NULL,
    tax_amount NUMERIC(15,2) NOT NULL,
    total_units INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_order_quote_supplier UNIQUE (quotation_request_id, supplier_quotation_id)
);

CREATE TABLE order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(15,2) NOT NULL,
    unit_price NUMERIC(15,2) NOT NULL,
    confirmed_price NUMERIC(15,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_quote_buyer ON quotation_requests(buyer_organization_id);
CREATE INDEX idx_quote_status ON quotation_requests(status);
CREATE INDEX idx_quote_rfq ON quotation_requests(rfq_number);
CREATE INDEX idx_sup_quote_rfq ON supplier_quotations(quotation_request_id);
CREATE INDEX idx_order_quote ON orders(quotation_request_id);
