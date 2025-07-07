import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceTemplate } from '../../models/invoice.model';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.css']
})
export class TemplateSelectorComponent implements OnInit {
  @Input() templates: InvoiceTemplate[] = [];
  @Input() selectedTemplate: InvoiceTemplate | null = null;
  @Output() templateSelected = new EventEmitter<InvoiceTemplate>();

  selectedCategory: 'all' | 'general' | 'construction' | 'supplier' | 'mechanic' = 'all';
  filteredTemplates: InvoiceTemplate[] = [];

  ngOnInit(): void {
    this.filterTemplates();
  }

  ngOnChanges(): void {
    this.filterTemplates();
  }

  selectTemplate(template: InvoiceTemplate): void {
    this.templateSelected.emit(template);
  }

  filterByCategory(category: 'all' | 'general' | 'construction' | 'supplier' | 'mechanic'): void {
    this.selectedCategory = category;
    this.filterTemplates();
  }

  private filterTemplates(): void {
    if (this.selectedCategory === 'all') {
      this.filteredTemplates = this.templates;
    } else {
      this.filteredTemplates = this.templates.filter(template => template.category === this.selectedCategory);
    }
  }

  getTemplateImage(templateId: string): string {
    const images: { [key: string]: string } = {
      'classic': 'https://i.pinimg.com/736x/47/a4/54/47a4546840e8ed1fcea0885697ef89ab.jpg',
      'modern': 'https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg?auto=compress&cs=tinysrgb&w=400',
      'professional': 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400',
      'creative': 'https://images.pexels.com/photos/7947761/pexels-photo-7947761.jpeg?auto=compress&cs=tinysrgb&w=400',
      'branded-left': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
      'branded-right': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
      'corporate': 'https://images.pexels.com/photos/7947807/pexels-photo-7947807.jpeg?auto=compress&cs=tinysrgb&w=400',
      'minimal': 'https://images.pexels.com/photos/6863074/pexels-photo-6863074.jpeg?auto=compress&cs=tinysrgb&w=400',
      'elegant': 'https://images.pexels.com/photos/6863195/pexels-photo-6863195.jpeg?auto=compress&cs=tinysrgb&w=400',
      'construction': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
      'construction-pro': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
      'supplier': 'https://images.pexels.com/photos/6863074/pexels-photo-6863074.jpeg?auto=compress&cs=tinysrgb&w=400',
      'supplier-pro': 'https://images.pexels.com/photos/6863074/pexels-photo-6863074.jpeg?auto=compress&cs=tinysrgb&w=400',
      'supplier-branded': 'https://images.pexels.com/photos/6863074/pexels-photo-6863074.jpeg?auto=compress&cs=tinysrgb&w=400',
      'supplier-minimal': 'https://images.pexels.com/photos/6863074/pexels-photo-6863074.jpeg?auto=compress&cs=tinysrgb&w=400',
      'mechanic': 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
      'mechanic-pro': 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    return images[templateId] || images['classic'];
  }
}