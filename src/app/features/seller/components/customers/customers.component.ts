import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customers-container">
      <h2>Customers Management</h2>
      <p>View and manage your customers here</p>
    </div>
  `,
  styles: [`
    .customers-container {
      padding: 1rem;
    }
  `]
})
export class CustomersComponent {} 