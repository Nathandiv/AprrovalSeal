import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

interface CoffeeOption {
  name: string;
  amount: number;
  emoji: string;
  description: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  selectedAmount: number = 0;
  customAmount: number = 0;
  supporterEmail: string = '';
  selectedPaymentMethod: 'paystack' | 'eft' | null = null;
  showEftDetails: boolean = false;

  coffeeOptions: CoffeeOption[] = [
    {
      name: 'Small Coffee',
      amount: 25,
      emoji: '☕',
      description: 'A quick thank you'
    },
    {
      name: 'Large Coffee',
      amount: 50,
      emoji: '☕☕',
      description: 'Really appreciate it!'
    },
    {
      name: 'Coffee & Snack',
      amount: 100,
      emoji: '☕🍪',
      description: 'You\'re awesome!'
    },
    {
      name: 'Lunch Support',
      amount: 200,
      emoji: '🍽️',
      description: 'Super generous!'
    }
  ];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    // Component initialization
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.customAmount = 0;
  }

  onCustomAmountChange(): void {
    if (this.customAmount && this.customAmount >= 5) {
      this.selectedAmount = this.customAmount;
    }
  }

  selectPaymentMethod(method: 'paystack' | 'eft'): void {
    this.selectedPaymentMethod = method;
    this.showEftDetails = false;
  }

  supportDeveloper(): void {
    if (!this.selectedAmount || this.selectedAmount < 5) {
      alert('Please select or enter an amount of at least R5');
      return;
    }

    if (!this.supporterEmail) {
      alert('Please enter your email address');
      return;
    }

    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (this.selectedPaymentMethod === 'paystack') {
      this.processPaystackPayment();
    } else if (this.selectedPaymentMethod === 'eft') {
      this.showEftPaymentDetails();
    }
  }

  private processPaystackPayment(): void {
    const reference = this.paymentService.generateReference();
    
    this.paymentService.initiatePayment({
      amount: this.selectedAmount,
      email: this.supporterEmail,
      reference: reference,
      callback: (response: any) => {
        if (response.status === 'success') {
          this.onPaymentSuccess(response);
        } else {
          this.onPaymentError('Payment was not completed');
        }
      },
      onClose: () => {
        console.log('Payment dialog closed');
      }
    });
  }

  private showEftPaymentDetails(): void {
    this.showEftDetails = true;
    
    // Scroll to EFT details
    setTimeout(() => {
      const eftElement = document.querySelector('[data-eft-details]');
      if (eftElement) {
        eftElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  closeEftDetails(): void {
    this.showEftDetails = false;
  }

  private onPaymentSuccess(response: any): void {
    alert(`Thank you for your support! 🎉\n\nPayment successful!\nReference: ${response.reference}\n\nYour contribution helps keep Invoice Maker free for all South African businesses!`);
    
    // Reset form
    this.resetForm();
    
    // You can also send the payment details to your backend here
    console.log('Payment successful:', response);
  }

  private onPaymentError(error: string): void {
    alert(`Payment failed: ${error}\n\nPlease try again or use the EFT option.`);
    console.error('Payment error:', error);
  }

  private resetForm(): void {
    this.selectedAmount = 0;
    this.customAmount = 0;
    this.supporterEmail = '';
    this.selectedPaymentMethod = null;
    this.showEftDetails = false;
  }
}