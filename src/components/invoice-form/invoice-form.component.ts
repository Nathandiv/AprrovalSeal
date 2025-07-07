import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceData, InvoiceItem, InvoiceTemplate } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { LogoUploadComponent } from '../logo-upload/logo-upload.component';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoUploadComponent],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  @Input() invoice!: InvoiceData;
  @Input() selectedTemplate: InvoiceTemplate | null = null;
  @Output() invoiceChange = new EventEmitter<InvoiceData>();

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    // Component initialization
  }

  updateInvoice(): void {
    const updatedInvoice = this.invoiceService.calculateInvoiceTotals(this.invoice);
    this.invoiceChange.emit(updatedInvoice);
  }

  addItem(): void {
    this.invoiceService.addInvoiceItem();
  }

  removeItem(itemId: string): void {
    this.invoiceService.removeInvoiceItem(itemId);
  }

  updateItem(itemId: string, updates: Partial<InvoiceItem>): void {
    this.invoiceService.updateInvoiceItem(itemId, updates);
  }

  trackByItemId(index: number, item: InvoiceItem): string {
    return item.id;
  }
}