import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LogoService, LogoData } from '../../services/logo.service';

@Component({
  selector: 'app-logo-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-upload.component.html',
  styleUrls: ['./logo-upload.component.css']
})
export class LogoUploadComponent implements OnInit, OnDestroy {
  currentLogo: LogoData = { file: null, url: null, name: null };
  isDragOver = false;
  private logoSubscription?: Subscription;

  constructor(private logoService: LogoService) {}

  ngOnInit(): void {
    this.logoSubscription = this.logoService.logo$.subscribe(logo => {
      this.currentLogo = logo;
    });
  }

  ngOnDestroy(): void {
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('logo-file-input') as HTMLInputElement;
    fileInput?.click();
  }

  removeLogo(): void {
    this.logoService.clearLogo();
  }

  private handleFile(file: File): void {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    this.logoService.setLogo(file);
  }
}