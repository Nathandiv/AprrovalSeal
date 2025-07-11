import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
 success = false;

async submitForm(form: NgForm) {
  if (form.invalid) return;

  const formData = new FormData();
  formData.append('access_key', '18155a87-df5c-4465-b923-8cb64eb3e1b3');

  // Append form fields
  Object.entries(form.value).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Web3Forms response:', result); 

    if (result.success) {
      this.success = true;
      form.resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(`Submission failed: ${result.message}`);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Network error. Please check your internet and try again.');
  }
}

}