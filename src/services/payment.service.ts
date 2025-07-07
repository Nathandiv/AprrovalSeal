import { Injectable } from '@angular/core';

declare var PaystackPop: any;

export interface PaymentData {
  amount: number;
  email: string;
  reference: string;
  callback: (response: any) => void;
  onClose: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paystackPublicKey = 'pk_test_your_paystack_public_key_here'; // Replace with your actual Paystack public key

  constructor() {
    this.loadPaystackScript();
  }

  private loadPaystackScript(): void {
    if (typeof PaystackPop !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.head.appendChild(script);
  }

  initiatePayment(paymentData: PaymentData): void {
    if (typeof PaystackPop === 'undefined') {
      console.error('Paystack script not loaded');
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    const handler = PaystackPop.setup({
      key: this.paystackPublicKey,
      email: paymentData.email,
      amount: paymentData.amount * 100, // Paystack expects amount in kobo (cents)
      currency: 'ZAR',
      ref: paymentData.reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Purpose",
            variable_name: "purpose",
            value: "Invoice Maker Support"
          }
        ]
      },
      callback: paymentData.callback,
      onClose: paymentData.onClose
    });

    handler.openIframe();
  }

  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV_SUPPORT_${timestamp}_${random}`;
  }
}