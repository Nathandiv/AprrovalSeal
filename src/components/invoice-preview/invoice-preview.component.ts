import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { InvoiceData, InvoiceTemplate } from '../../models/invoice.model';
import { LogoService, LogoData } from '../../services/logo.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css']
})
export class InvoicePreviewComponent implements OnInit, OnDestroy {
  @Input() invoice!: InvoiceData;
  @Input() selectedTemplate: InvoiceTemplate | null = null;

  currentLogo: LogoData = { file: null, url: null, name: null };
  private logoSubscription?: Subscription;

  constructor(private logoService: LogoService) {}

  ngOnInit(): void {
    // Subscribe to logo changes
    this.logoSubscription = this.logoService.logo$.subscribe(logo => {
      this.currentLogo = logo;
    });
  }

  ngOnDestroy(): void {
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
  }

  getTemplateClass(): string {
    if (!this.selectedTemplate) return '';
    
    const classes: { [key: string]: string } = {
      'classic': 'font-sans',
      'modern': 'font-sans',
      'professional': 'font-sans',
      'creative': 'font-sans',
      'branded-left': 'font-sans branded-left',
      'branded-right': 'font-sans branded-right',
      'corporate': 'font-sans',
      'minimal': 'font-sans',
      'elegant': 'font-sans',
      'construction': 'font-sans',
      'construction-pro': 'font-sans',
      'supplier': 'font-sans',
      'supplier-pro': 'font-sans',
      'mechanic': 'font-sans',
      'mechanic-pro': 'font-sans'
    };
    
    return classes[this.selectedTemplate.id] || '';
  }

  hasLogo(): boolean {
    return (this.selectedTemplate?.hasLogo ?? false) && !!this.currentLogo.url;
  }

  getLogoUrl(): string {
    return this.currentLogo.url || '';
  }

  shouldShowLogoPlaceholder(): boolean {
    return (this.selectedTemplate?.hasLogo ?? false) && !this.currentLogo.url;
  }
}