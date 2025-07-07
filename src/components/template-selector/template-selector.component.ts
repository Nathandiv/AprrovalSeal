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
      'classic': 'https://i.pinimg.com/736x/e0/be/f1/e0bef127bca076f3631cd1d44b373680.jpg',
      'modern': 'https://i.pinimg.com/736x/42/5f/cd/425fcd8a94c9174e39f00b9091b5c781.jpg',
      'professional': 'https://i.pinimg.com/736x/58/c5/35/58c5359a5c74aa0c12882a12a976e2ff.jpg',
      'creative': 'https://i.pinimg.com/736x/ec/16/86/ec1686b1a4da57a91abb6e748ff2fcf2.jpg',
      'corporate': 'https://images.pexels.com/photos/7947807/pexels-photo-7947807.jpeg?auto=compress&cs=tinysrgb&w=400',
      'minimal': 'https://i.pinimg.com/736x/3d/16/01/3d1601956fda317e929890a9c25958f3.jpg',
      'elegant': 'https://i.pinimg.com/736x/23/ba/b6/23bab6c8a467b921d17e0ffd4487ef00.jpg',
      'construction': 'https://i.pinimg.com/736x/a2/40/30/a24030edca7b89a26c9984b0b61c6b0c.jpg',
      'supplier': 'https://i.pinimg.com/736x/42/5f/cd/425fcd8a94c9174e39f00b9091b5c781.jpg',
      'mechanic': 'https://i.pinimg.com/736x/98/a8/63/98a863f6165e21eacaa6ff1314487af7.jpg',
    };
    return images[templateId] || images['classic'];
  }
}