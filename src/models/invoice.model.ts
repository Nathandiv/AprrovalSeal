export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  // Company Info
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  
  // Client Info
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  
  // Invoice Items
  items: InvoiceItem[];
  
  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Notes
  notes: string;
  
  // Template
  template: string;
  
  // Invoice Title (editable)
  invoiceTitle: string;
  
  // Logo
  logoUrl?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'general' | 'construction' | 'supplier' | 'mechanic';
  hasLogo: boolean;
  logoPosition?: 'left' | 'right' | 'center';
  defaultTitle: string;
  styles: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    layout: 'classic' | 'modern' | 'professional' | 'creative' | 'branded' | 'corporate' | 'minimal' | 'elegant' | 'construction' | 'construction-pro' | 'supplier' | 'supplier-pro' | 'supplier-branded' | 'supplier-minimal' | 'mechanic' | 'mechanic-pro';
  };
}