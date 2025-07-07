import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LogoData {
  file: File | null;
  url: string | null;
  name: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private logoSubject = new BehaviorSubject<LogoData>({
    file: null,
    url: null,
    name: null
  });

  public logo$ = this.logoSubject.asObservable();

  constructor() {}

  setLogo(file: File): void {
    const url = URL.createObjectURL(file);
    const logoData: LogoData = {
      file: file,
      url: url,
      name: file.name
    };
    this.logoSubject.next(logoData);
  }

  clearLogo(): void {
    const currentLogo = this.logoSubject.value;
    if (currentLogo.url) {
      URL.revokeObjectURL(currentLogo.url);
    }
    this.logoSubject.next({
      file: null,
      url: null,
      name: null
    });
  }

  getCurrentLogo(): LogoData {
    return this.logoSubject.value;
  }
}