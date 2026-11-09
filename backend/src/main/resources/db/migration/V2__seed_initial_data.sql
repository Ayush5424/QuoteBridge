-- V2__seed_initial_data.sql
-- Seed organizations, suppliers, quotations and orders

INSERT INTO organizations (id, name, type, contact_email, contact_phone, address, status) VALUES
('org-freshmarket', 'FreshMarket Central', 'BUYER', 'procurement@freshmarket.com', '+1 (555) 234-5678', 'Building 7, Suite 300, Austin TX', 'ACTIVE'),
('org-urban', 'Urban Retail Co.', 'BUYER', 'ops@urbanretail.com', '+1 (555) 432-8765', 'Warehouse 4B, Central Logistics Hub, Chicago IL', 'ACTIVE'),
('org-nexus', 'Nexus Global Logistics', 'SUPPLIER', 'contact@nexusglobal.com', '+1 (555) 902-1144', 'Port Logistics Tower, Long Beach CA', 'ACTIVE'),
('org-globaltech', 'Global Tech Corp', 'SUPPLIER', 'sales@globaltechcorp.com', '+1 (555) 321-4455', 'Technology Way, Dallas TX', 'ACTIVE'),
('org-swift', 'Swift Logistics', 'SUPPLIER', 'elena@swiftlogistics.io', '+1 (555) 778-9900', 'Enterprise Park, Houston TX', 'ACTIVE'),
('org-metro', 'Metro Supplies', 'SUPPLIER', 'dvance@metrosupplies.com', '+1 (555) 441-2299', 'Metro Industrial Depot, Austin TX', 'ACTIVE');

INSERT INTO suppliers (id, organization_id, supplier_tier, contact_name, contact_role, contact_email, contact_phone, status) VALUES
('sup-nexus', 'org-nexus', 'Verified Enterprise Partner', 'Sarah Jenkins', 'Account Manager', 's.jenkins@nexusglobal.com', '+1 (555) 902-1144', 'ACTIVE'),
('sup-a', 'org-globaltech', 'Tier 1 Supplier', 'Robert Miller', 'Corporate Sales Lead', 'sales@globaltechcorp.com', '+1 (555) 321-4455', 'ACTIVE'),
('sup-b', 'org-swift', 'Top Rated', 'Elena Rostova', 'Key Account Executive', 'elena@swiftlogistics.io', '+1 (555) 778-9900', 'ACTIVE'),
('sup-c', 'org-metro', 'Local Vendor', 'David Vance', 'Operations Dispatch', 'dvance@metrosupplies.com', '+1 (555) 441-2299', 'ACTIVE');

-- Quotation 1: Industrial Hardware & Logistics
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, selected_supplier_id, selected_response_id, created_at) VALUES
('quote-1', '#RQ-2024-0089', 'Industrial Hardware & Logistics', 'org-urban', 'Urban Retail Co.', 'Warehouse 4B, Central Logistics Hub, Chicago IL', '2023-10-28', 'High Priority', 'We are looking for industrial hub assemblies and specialized coating services for our upcoming Q4 rollout. Firm delivery timelines required.', 'Accepted', 'sup-nexus', 'resp-nexus-1', '2023-10-24 10:00:00+00');

INSERT INTO quotation_items (id, quotation_request_id, product_name, quantity, unit, reference) VALUES
('qi-1', 'quote-1', 'Industrial Hub Assembly - V4', 200, 'units', 'HA-409'),
('qi-2', 'quote-1', 'Specialized Coating Service', 1, 'units', 'SCS-01'),
('qi-3', 'quote-1', 'Expedited Shipping & Handling', 1, 'units', 'ESH-99');

INSERT INTO supplier_quotations (id, quotation_request_id, supplier_id, supplier_name, supplier_tier, contact_name, contact_role, contact_email, contact_phone, validity_days, general_terms, shipping_route, est_delivery_days, total_amount, status, submitted_at) VALUES
('resp-nexus-1', 'quote-1', 'sup-nexus', 'Nexus Global Logistics', 'Verified Enterprise Partner', 'Sarah Jenkins', 'Account Manager', 's.jenkins@nexusglobal.com', '+1 (555) 902-1144', 15, 'FOB Destination. Net 30 payment terms. Includes standard cargo insurance coverage.', 'Shanghai → Los Angeles', 4, 12450.00, 'Accepted', '2023-10-24 14:30:00+00');

INSERT INTO supplier_quotation_items (id, supplier_quotation_id, product_id, available, unit_price, est_delivery_date, notes) VALUES
('sqi-1', 'resp-nexus-1', 'qi-1', TRUE, 45.00, '2023-10-24', 'In stock at central warehouse'),
('sqi-2', 'resp-nexus-1', 'qi-2', TRUE, 1250.00, '2023-10-24', 'Certified military grade finish'),
('sqi-3', 'resp-nexus-1', 'qi-3', TRUE, 2200.00, '2023-10-24', 'Air express tier');

-- Order 1:
INSERT INTO orders (id, order_number, quotation_request_id, supplier_quotation_id, buyer_organization_id, supplier_name, contact_name, contact_role, contact_email, contact_phone, business_name, delivery_location, confirmed_date, expected_delivery, shipping_route, total_cost, tax_amount, total_units, status, created_at) VALUES
('order-1', '#QB-94420-2023', 'quote-1', 'resp-nexus-1', 'org-urban', 'Nexus Global Logistics', 'Sarah Jenkins', 'Account Manager', 's.jenkins@nexusglobal.com', '+1 (555) 902-1144', 'Urban Retail Co.', 'Warehouse 4B, Central Logistics Hub, Chicago IL', 'Oct 24, 2023', 'Oct 24, 2023', 'Shanghai → Los Angeles', 12450.00, 1494.00, 202, 'Confirmed', '2023-10-24 16:00:00+00');

INSERT INTO order_items (id, order_id, description, quantity, unit_price, confirmed_price) VALUES
('oi-1', 'order-1', 'Industrial Hub Assembly - V4', 200, 45.00, 9000.00),
('oi-2', 'order-1', 'Specialized Coating Service', 1, 1250.00, 1250.00),
('oi-3', 'order-1', 'Expedited Shipping & Handling', 1, 2200.00, 2200.00);

-- Quotation 2: Workstation Tech & Peripherals (Comparison ready)
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-2', '#RQ-2024-0092', 'Workstation Tech & Peripherals', 'org-freshmarket', 'FreshMarket Central Tech Hub', 'Building 7, Suite 300, Austin TX', '2023-11-02', 'Normal', 'Procurement of office displays, mechanical peripherals, high speed hubs, and cables for engineer workstations.', 'Received', '2023-10-25 09:00:00+00');

INSERT INTO quotation_items (id, quotation_request_id, product_name, quantity, unit, specs) VALUES
('qi-4', 'quote-2', 'Dell 27" 4K Monitor', 5, 'units', 'U2723QE - Black'),
('qi-5', 'quote-2', 'Mechanical Keyboard', 10, 'units', 'Logitech MX Mechanical'),
('qi-6', 'quote-2', 'USB-C Hub (11-in-1)', 12, 'units', 'Anker PowerExpand'),
('qi-7', 'quote-2', 'Thunderbolt 4 Cable', 20, 'units', '2m Active Cable');

-- 3 Supplier responses for Quote 2
INSERT INTO supplier_quotations (id, quotation_request_id, supplier_id, supplier_name, supplier_tier, contact_name, contact_role, contact_email, contact_phone, validity_days, general_terms, shipping_route, est_delivery_days, total_amount, status, submitted_at) VALUES
('resp-comp-a', 'quote-2', 'sup-a', 'Global Tech Corp', 'Tier 1 Supplier', 'Robert Miller', 'Corporate Sales Lead', 'sales@globaltechcorp.com', '+1 (555) 321-4455', 30, 'Standard enterprise warranty. 2% discount on net 10.', 'Dallas → Austin', 5, 45800.00, 'Submitted', '2023-10-26 11:00:00+00'),
('resp-comp-b', 'quote-2', 'sup-b', 'Swift Logistics', 'Top Rated', 'Elena Rostova', 'Key Account Executive', 'elena@swiftlogistics.io', '+1 (555) 778-9900', 15, 'Best volume pricing guaranteed for 15 days.', 'Houston → Austin', 4, 43450.00, 'Submitted', '2023-10-26 13:30:00+00'),
('resp-comp-c', 'quote-2', 'sup-c', 'Metro Supplies', 'Local Vendor', 'David Vance', 'Operations Dispatch', 'dvance@metrosupplies.com', '+1 (555) 441-2299', 7, 'Same day dispatch available if confirmed before 2 PM.', 'Local Depot → Austin', 2, 46200.00, 'Submitted', '2023-10-27 08:45:00+00');

INSERT INTO supplier_quotation_items (id, supplier_quotation_id, product_id, available, unit_price) VALUES
('sqi-4', 'resp-comp-a', 'qi-4', TRUE, 5200.00),
('sqi-5', 'resp-comp-a', 'qi-5', TRUE, 1200.00),
('sqi-6', 'resp-comp-a', 'qi-6', TRUE, 850.00),
('sqi-7', 'resp-comp-a', 'qi-7', TRUE, 450.00),

('sqi-8', 'resp-comp-b', 'qi-4', TRUE, 4800.00),
('sqi-9', 'resp-comp-b', 'qi-5', TRUE, 1150.00),
('sqi-10', 'resp-comp-b', 'qi-6', TRUE, 900.00),
('sqi-11', 'resp-comp-b', 'qi-7', TRUE, 420.00),

('sqi-12', 'resp-comp-c', 'qi-4', TRUE, 5100.00),
('sqi-13', 'resp-comp-c', 'qi-5', TRUE, 1100.00),
('sqi-14', 'resp-comp-c', 'qi-6', FALSE, 0.00),
('sqi-15', 'resp-comp-c', 'qi-7', TRUE, 480.00);

-- Quotation 3: Cold Storage Freight Dispatch
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-3', '#RQ-2024-0104', 'Cold Storage Freight Dispatch', 'org-freshmarket', 'FreshMarket Central', 'Distribution Center 9, Seattle WA', '2023-10-29', 'High Priority', 'Temperature controlled refrigerated container transport.', 'Pending', '2023-10-26 14:00:00+00');

INSERT INTO quotation_items (id, quotation_request_id, product_name, quantity, unit) VALUES
('qi-8', 'quote-3', 'Refrigerated Reefer Containers', 4, 'units'),
('qi-9', 'quote-3', 'IoT Temp Monitoring Modules', 8, 'units');

-- Quotation 4: Cloud Infrastructure Expansion
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-4', '#QB-2024-089', 'Cloud Infrastructure Expansion', 'org-freshmarket', 'Apex Data Corp', 'Primary Cloud Datacenter, Ashburn VA', '2023-10-20', 'Normal', 'Enterprise rack switch provisioning.', 'Accepted', '2023-10-12 11:00:00+00');

-- Quotation 5: Security Audit Services
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-5', '#QB-2024-088', 'Security Audit Services', 'org-freshmarket', 'FreshMarket HQ', 'Remote & On-Site Security Assessment', '2023-10-15', 'Normal', 'Penetration testing & red teaming review.', 'Rejected', '2023-10-10 09:30:00+00');

-- Quotation 6: Bulk Hardware Procurement
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-6', '#QB-2024-085', 'Bulk Hardware Procurement', 'org-freshmarket', 'FreshMarket Retail Network', 'Central Fulfillment Facility, Denver CO', '2023-10-05', 'Normal', 'Enterprise point-of-sale terminals.', 'Expired', '2023-09-28 10:15:00+00');

-- Quotation 7: Office Remodeling Phase 1
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-7', '#QB-2024-082', 'Office Remodeling Phase 1', 'org-urban', 'Urban Retail Co.', 'Corporate HQ, Floor 4, Boston MA', '2023-09-25', 'Normal', 'Acoustic partition panels and conference pod fitting.', 'Accepted', '2023-09-15 08:00:00+00');

-- Quotation 8: Custom Software Module
INSERT INTO quotation_requests (id, rfq_number, title, buyer_organization_id, business_name, delivery_location, required_by_date, priority, details, status, created_at) VALUES
('quote-8', '#QB-2024-079', 'Custom Software Module', 'org-urban', 'Urban Retail Co.', 'Digital Delivery / GitHub Enterprise', '2023-09-01', 'Normal', 'Real-time inventory sync middleware.', 'Pending', '2023-08-22 13:00:00+00');
