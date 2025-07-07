import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InvoiceData, InvoiceItem, InvoiceTemplate } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private currentInvoiceSubject = new BehaviorSubject<InvoiceData>(this.getDefaultInvoice());
  public currentInvoice$ = this.currentInvoiceSubject.asObservable();

  private templatesSubject = new BehaviorSubject<InvoiceTemplate[]>(this.getDefaultTemplates());
  public templates$ = this.templatesSubject.asObservable();

  constructor() {}

  getCurrentInvoice(): InvoiceData {
    return this.currentInvoiceSubject.value;
  }

  updateInvoice(invoice: InvoiceData): void {
    this.currentInvoiceSubject.next(invoice);
  }

  generateInvoiceNumber(): string {
    const timestamp = Date.now();
    return `INV-${timestamp.toString().slice(-8)}`;
  }

  calculateInvoiceTotals(invoice: InvoiceData): InvoiceData {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;

    return {
      ...invoice,
      subtotal,
      taxAmount,
      total
    };
  }

  addInvoiceItem(): void {
    const currentInvoice = this.getCurrentInvoice();
    const newItem: InvoiceItem = {
      id: this.generateId(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    
    currentInvoice.items.push(newItem);
    this.updateInvoice(this.calculateInvoiceTotals(currentInvoice));
  }

  removeInvoiceItem(itemId: string): void {
    const currentInvoice = this.getCurrentInvoice();
    currentInvoice.items = currentInvoice.items.filter(item => item.id !== itemId);
    this.updateInvoice(this.calculateInvoiceTotals(currentInvoice));
  }

  updateInvoiceItem(itemId: string, updatedItem: Partial<InvoiceItem>): void {
    const currentInvoice = this.getCurrentInvoice();
    const itemIndex = currentInvoice.items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      const item = { ...currentInvoice.items[itemIndex], ...updatedItem };
      item.amount = item.quantity * item.rate;
      currentInvoice.items[itemIndex] = item;
      this.updateInvoice(this.calculateInvoiceTotals(currentInvoice));
    }
  }

  updateInvoiceTitle(templateId: string): void {
    const currentInvoice = this.getCurrentInvoice();
    const template = this.getDefaultTemplates().find(t => t.id === templateId);
    if (template) {
      currentInvoice.invoiceTitle = template.defaultTitle;
      this.updateInvoice(currentInvoice);
    }
  }

  resetInvoice(): void {
    this.updateInvoice(this.getDefaultInvoice());
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultInvoice(): InvoiceData {
    return {
      id: this.generateId(),
      invoiceNumber: this.generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      companyName: '',
      companyAddress: '',
      companyEmail: '',
      companyPhone: '',
      
      clientName: '',
      clientAddress: '',
      clientEmail: '',
      
      items: [
        {
          id: this.generateId(),
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ],
      
      subtotal: 0,
      taxRate: 15, // South African VAT rate
      taxAmount: 0,
      total: 0,
      
      notes: '',
      template: 'classic',
      invoiceTitle: 'INVOICE',
      logoUrl: undefined
    };
  }

  private getDefaultTemplates(): InvoiceTemplate[] {
    return [
      // General Business Templates (No Logo Support)
      {
        id: 'classic',
        name: 'Classic',
        description: 'Clean and professional design with traditional layout',
        preview: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'general',
        hasLogo: false,
        defaultTitle: 'INVOICE',
        styles: {
          primaryColor: '#1f2937',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'classic'
        }
      },
      {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with bold typography and minimal layout',
        preview: 'https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'general',
        hasLogo: false,
        defaultTitle: 'INVOICE',
        styles: {
          primaryColor: '#0f172a',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'modern'
        }
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Corporate-style template perfect for business use',
        preview: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'general',
        hasLogo: false,
        defaultTitle: 'INVOICE',
        styles: {
          primaryColor: '#374151',
          accentColor: '#1f2937',
          fontFamily: 'Inter',
          layout: 'professional'
        }
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Vibrant and modern design for creative professionals',
        preview: 'https://images.pexels.com/photos/7947761/pexels-photo-7947761.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'general',
        hasLogo: false,
        defaultTitle: 'INVOICE',
        styles: {
          primaryColor: '#1f2937',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'creative'
        }
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple design focusing on content',
        preview: 'https://images.pexels.com/photos/6863074/pexels-photo-6863074.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'general',
        hasLogo: false,
        defaultTitle: 'INVOICE',
        styles: {
          primaryColor: '#374151',
          accentColor: '#6b7280',
          fontFamily: 'Inter',
          layout: 'minimal'
        }
      },
      {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated design with refined typography',
        preview: 'https://images.pexels.com/photos/6863195/pexels-photo-6863195.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'general',
        hasLogo: false,
        defaultTitle: 'INVOICE',
        styles: {
          primaryColor: '#1f2937',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'elegant'
        }
      },
      // Construction Industry Templates
      {
        id: 'construction',
        name: 'Construction',
        description: 'Specialized template for construction and building services',
        preview: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'construction',
        hasLogo: false,
        defaultTitle: 'CONSTRUCTION INVOICE',
        styles: {
          primaryColor: '#1f2937',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'construction'
        }
      },
      // Supplier Industry Templates
      {
        id: 'supplier',
        name: 'Supplier',
        description: 'Professional template for suppliers and vendors',
        preview: 'https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'supplier',
        hasLogo: false,
        defaultTitle: 'SUPPLIER INVOICE',
        styles: {
          primaryColor: '#1f2937',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'supplier'
        }
      },
      // Mechanic Industry Templates
      {
        id: 'mechanic',
        name: 'Mechanic',
        description: 'Specialized template for automotive and mechanical services',
        preview: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'mechanic',
        hasLogo: false,
        defaultTitle: 'MECHANIC INVOICE',
        styles: {
          primaryColor: '#1f2937',
          accentColor: '#374151',
          fontFamily: 'Inter',
          layout: 'mechanic'
        }
      }
    ];
  }
}