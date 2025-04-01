import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreDetails } from '../../../core/models';

@Component({
  selector: 'app-store-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Become a Seller</h2>
          <button class="close-btn" (click)="close()">&times;</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="storeName">Store Name</label>
              <input 
                type="text" 
                id="storeName" 
                [(ngModel)]="storeDetails.storeName" 
                name="storeName" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="storeDescription">Store Description</label>
              <textarea 
                id="storeDescription" 
                [(ngModel)]="storeDetails.storeDescription" 
                name="storeDescription" 
                required
                class="form-control"
                rows="4"
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="close()">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
    }

    .btn-primary {
      background-color: #4a4a4a;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class StoreDetailsModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitStoreDetails = new EventEmitter<StoreDetails>();

  storeDetails: StoreDetails = {
    storeName: '',
    storeDescription: ''
  };

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    this.submitStoreDetails.emit(this.storeDetails);
  }
} 