import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../../core/services/notifier.service';
import { NotificationType } from '../../../../core/models/enums/notification-type';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification" [ngClass]="getNotificationClass()">
      <div class="notification-content">
        <span class="notification-message">{{ notification.message }}</span>
        <button class="notification-button" (click)="close()">
          {{ notification.buttonText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      display: flex;
      padding: 12px 16px;
      margin: 8px 0;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      min-width: 200px;
      max-width: 500px;
      animation: slide-in 0.3s ease-out;
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .notification-message {
      flex: 1;
      margin-right: 16px;
    }
    
    .notification-button {
      padding: 4px 8px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 500;
      white-space: nowrap;
    }
    
    .notification.success {
      background-color: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }
    
    .notification.success .notification-button {
      color: #155724;
    }
    
    .notification.error {
      background-color: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }
    
    .notification.error .notification-button {
      color: #721c24;
    }
    
    .notification.warning {
      background-color: #fff3cd;
      color: #856404;
      border-left: 4px solid #ffc107;
    }
    
    .notification.warning .notification-button {
      color: #856404;
    }
    
    .notification.info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }
    
    .notification.info .notification-button {
      color: #0c5460;
    }
  `]
})
export class NotificationComponent {
  @Input() notification!: Notification;
  @Output() closed = new EventEmitter<Notification>();
  
  close() {
    this.closed.emit(this.notification);
  }
  
  getNotificationClass(): string {
    switch (this.notification.type) {
      case NotificationType.SUCCESS:
        return 'success';
      case NotificationType.ERROR:
        return 'error';
      case NotificationType.WARNING:
        return 'warning';
      case NotificationType.INFO:
        return 'info';
      default:
        return '';
    }
  }
} 