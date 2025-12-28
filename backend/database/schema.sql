-- VetFlow Database Schema
-- PostgreSQL / SQLite compatible

-- Clients (Pet Owners)
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    hubspot_contact_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients (Pets)
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    gender VARCHAR(10),
    weight DECIMAL(10,2),
    microchip VARCHAR(50),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    notes TEXT,
    triage_responses TEXT, -- JSON format
    confirmation_sent BOOLEAN DEFAULT FALSE,
    reminder_24h_sent BOOLEAN DEFAULT FALSE,
    reminder_2h_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Clinical Records
CREATE TABLE IF NOT EXISTS clinical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER,
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chief_complaint TEXT,
    symptoms TEXT,
    physical_exam TEXT,
    diagnosis TEXT NOT NULL,
    treatment TEXT NOT NULL,
    medications TEXT,
    lab_results TEXT,
    images TEXT, -- JSON array of image URLs
    notes TEXT,
    follow_up_date DATE,
    veterinarian VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Vaccinations
CREATE TABLE IF NOT EXISTS vaccinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    vaccine_name VARCHAR(255) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    batch_number VARCHAR(100),
    manufacturer VARCHAR(255),
    veterinarian VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Deworming Records
CREATE TABLE IF NOT EXISTS dewormings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    application_date DATE NOT NULL,
    next_due_date DATE,
    type VARCHAR(50), -- internal, external, both
    weight_at_application DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Communications Log
CREATE TABLE IF NOT EXISTS communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    channel VARCHAR(50) NOT NULL, -- whatsapp, email, sms
    type VARCHAR(100), -- confirmation, reminder, followup, etc
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message TEXT,
    external_id VARCHAR(255), -- Message ID from external service
    metadata TEXT, -- JSON format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Message Templates
CREATE TABLE IF NOT EXISTS message_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    channel VARCHAR(50), -- whatsapp, email, sms, all
    subject VARCHAR(500), -- For emails
    content TEXT NOT NULL,
    variables TEXT, -- JSON array of variable names
    language VARCHAR(10) DEFAULT 'es',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Educational Content
CREATE TABLE IF NOT EXISTS educational_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    summary TEXT,
    content TEXT NOT NULL,
    content_type VARCHAR(50), -- article, video, pdf
    file_url TEXT,
    tags TEXT, -- JSON array
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL, -- appointment_created, appointment_completed, etc
    trigger_timing VARCHAR(100), -- immediate, 24h_before, 2h_before, 3d_after, etc
    action_type VARCHAR(100) NOT NULL, -- send_message, send_email, create_task
    action_config TEXT NOT NULL, -- JSON configuration
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled Jobs (for automation engine)
CREATE TABLE IF NOT EXISTS scheduled_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_type VARCHAR(100) NOT NULL,
    reference_id INTEGER, -- ID of related record (appointment, etc)
    reference_type VARCHAR(50), -- appointment, patient, etc
    scheduled_for TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP,
    result TEXT, -- JSON format
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    type VARCHAR(50), -- string, number, boolean, json
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_clinical_records_patient ON clinical_records(patient_id);
CREATE INDEX idx_communications_client ON communications(client_id);
CREATE INDEX idx_communications_status ON communications(status);
CREATE INDEX idx_scheduled_jobs_scheduled_for ON scheduled_jobs(scheduled_for);
CREATE INDEX idx_scheduled_jobs_status ON scheduled_jobs(status);
CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id);
CREATE INDEX idx_vaccinations_next_due ON vaccinations(next_due_date);

-- ============================================
-- BILLING & INVENTORY SYSTEM TABLES
-- ============================================

-- Invoices (Facturas)
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clinic_id INTEGER DEFAULT 1,
    client_id INTEGER NOT NULL,
    patient_id INTEGER,
    appointment_id INTEGER,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled, partial
    payment_method VARCHAR(50), -- cash, card, transfer, online
    payment_date TIMESTAMP,
    payment_reference VARCHAR(255),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Invoice Items (Líneas de factura)
CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- service, product, medication, vaccine
    item_id INTEGER, -- Reference to inventory_items if applicable
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Inventory Items (Productos en inventario)
CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clinic_id INTEGER DEFAULT 1,
    category VARCHAR(100) NOT NULL, -- medication, vaccine, supply, food, accessory
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0,
    max_stock DECIMAL(10,2),
    unit VARCHAR(50) DEFAULT 'unit', -- unit, ml, gr, kg, box, etc
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    sale_price DECIMAL(10,2) NOT NULL,
    supplier_id INTEGER,
    expiration_date DATE,
    batch_number VARCHAR(100),
    location VARCHAR(255), -- shelf location in clinic
    is_active BOOLEAN DEFAULT TRUE,
    low_stock_alert BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Inventory Transactions (Movimientos de inventario)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    clinic_id INTEGER DEFAULT 1,
    transaction_type VARCHAR(50) NOT NULL, -- purchase, sale, adjustment, waste, return
    quantity DECIMAL(10,2) NOT NULL, -- positive for IN, negative for OUT
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reference_type VARCHAR(50), -- invoice, purchase_order, adjustment
    reference_id INTEGER,
    previous_stock DECIMAL(10,2),
    new_stock DECIMAL(10,2),
    notes TEXT,
    user_id VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- Suppliers (Proveedores)
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clinic_id INTEGER DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    tax_id VARCHAR(100),
    payment_terms VARCHAR(255), -- 30 days, 60 days, cash, etc
    is_active BOOLEAN DEFAULT TRUE,
    rating INTEGER, -- 1-5 stars
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders (Órdenes de compra)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clinic_id INTEGER DEFAULT 1,
    supplier_id INTEGER NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    received_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, ordered, received, cancelled
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_order_id INTEGER NOT NULL,
    item_id INTEGER, -- Reference to inventory_items
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE SET NULL
);

-- Payment Records (for tracking partial payments)
CREATE TABLE IF NOT EXISTS payment_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference VARCHAR(255),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Indexes for billing and inventory
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX idx_inventory_items_low_stock ON inventory_items(low_stock_alert);
CREATE INDEX idx_inventory_transactions_item ON inventory_transactions(item_id);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

-- Insert default templates
INSERT INTO message_templates (name, category, channel, content, variables) VALUES
('appointment_confirmation', 'appointments', 'whatsapp', 
 'Hola {{client_name}}, tu cita ha sido confirmada ✅\n\n📅 Fecha: {{date}}\n⏰ Hora: {{time}}\n🐾 Mascota: {{pet_name}}\n📋 Tipo: {{type}}\n\nTe esperamos en nuestra clínica.',
 '["client_name", "date", "time", "pet_name", "type"]'),

('reminder_24h', 'appointments', 'whatsapp',
 'Recordatorio de cita ⏰\n\nHola {{client_name}},\n\nTe recordamos tu cita mañana:\n📅 {{date}} a las {{time}}\n🐾 {{pet_name}}\n\nPor favor responde estas preguntas de triage:\n1. ¿Cuál es el motivo principal de la consulta?\n2. ¿Ha presentado algún síntoma?\n3. ¿Está comiendo y bebiendo normalmente?\n4. ¿Algún cambio en el comportamiento?',
 '["client_name", "date", "time", "pet_name"]'),

('reminder_2h', 'appointments', 'whatsapp',
 '⏰ Recordatorio: Tu cita es en 2 horas\n\n{{client_name}}, te esperamos hoy a las {{time}} para la consulta de {{pet_name}}.\n\n¡Nos vemos pronto!',
 '["client_name", "time", "pet_name"]'),

('post_consultation', 'clinical', 'whatsapp',
 'Instrucciones de cuidado 📋\n\nHola {{client_name}},\n\nAquí están las instrucciones para {{pet_name}}:\n\n{{instructions}}\n\nSi tienes alguna duda, contáctanos inmediatamente.',
 '["client_name", "pet_name", "instructions"]'),

('followup_3d', 'followup', 'whatsapp',
 'Seguimiento de {{pet_name}} 🔄\n\nHola {{client_name}},\n\n¿Cómo ha evolucionado {{pet_name}} después de la consulta?\n\nNos encantaría saber si ha mejorado su condición.',
 '["client_name", "pet_name"]'),

('vaccination_reminder', 'preventive', 'whatsapp',
 '💉 Recordatorio de Vacunación\n\nHola {{client_name}},\n\nEs momento de la próxima vacuna de {{pet_name}}:\n\nVacuna: {{vaccine_name}}\nFecha recomendada: {{due_date}}\n\n¿Deseas agendar una cita?',
 '["client_name", "pet_name", "vaccine_name", "due_date"]');

-- Insert default settings
INSERT INTO settings (key, value, type, description) VALUES
('clinic_name', 'VetFlow Clinic', 'string', 'Nombre de la clínica'),
('clinic_phone', '+1234567890', 'string', 'Teléfono de contacto'),
('clinic_email', 'contact@vetflow.com', 'string', 'Email de contacto'),
('enable_auto_confirmations', 'true', 'boolean', 'Habilitar confirmaciones automáticas'),
('enable_auto_reminders', 'true', 'boolean', 'Habilitar recordatorios automáticos'),
('enable_auto_followups', 'true', 'boolean', 'Habilitar seguimientos automáticos');
