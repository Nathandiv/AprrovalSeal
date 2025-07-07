import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { InvoiceService } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf.service';
import { InvoiceData, InvoiceTemplate } from '../../models/invoice.model';

import { TemplateSelectorComponent } from '../../components/template-selector/template-selector.component';
import { InvoiceFormComponent } from '../../components/invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TemplateSelectorComponent,
    InvoiceFormComponent,
    InvoicePreviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentInvoice!: InvoiceData;
  templates$!: Observable<InvoiceTemplate[]>;
  selectedTemplate: InvoiceTemplate | null = null;
  isGeneratingPDF = false;

  constructor(
    private invoiceService: InvoiceService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.templates$ = this.invoiceService.templates$;
    
    this.invoiceService.currentInvoice$.subscribe(invoice => {
      this.currentInvoice = invoice;
    });

    // Set default template
    this.invoiceService.templates$.subscribe(templates => {
      if (templates.length > 0 && !this.selectedTemplate) {
        this.selectedTemplate = templates[0];
        this.currentInvoice.template = templates[0].id;
      }
    });
  }

  onTemplateSelected(template: InvoiceTemplate): void {
    this.selectedTemplate = template;
    this.currentInvoice.template = template.id;
    // Update invoice title based on selected template
    this.currentInvoice.invoiceTitle = template.defaultTitle;
    this.invoiceService.updateInvoice(this.currentInvoice);
  }

  onInvoiceChange(invoice: InvoiceData): void {
    this.currentInvoice = invoice;
    this.invoiceService.updateInvoice(invoice);
  }

  async downloadPDF(): Promise<void> {
    if (!this.currentInvoice.companyName || !this.currentInvoice.clientName) {
      alert('Please fill in at least company name and client name before downloading.');
      return;
    }

    this.isGeneratingPDF = true;
    
    try {
      await this.pdfService.generatePDF(this.currentInvoice, 'invoice-preview');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  resetInvoice(): void {
    if (confirm('Are you sure you want to create a new invoice? All current data will be lost.')) {
      this.invoiceService.resetInvoice();
    }
  }
}