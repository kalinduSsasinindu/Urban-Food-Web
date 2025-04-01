import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierService, Notification } from '../../../../core/services/notifier.service';
import { NotificationComponent } from '../notification/notification.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  template: `
    <div class="notification-container">
      <app-notification 
        *ngFor="let notification of notifications" 
        [notification]="notification"
        (closed)="onNotificationClosed(notification)">
      </app-notification>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      max-width: 500px;
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription!: Subscription;
  
  constructor(private notifierService: NotifierService) {}
  
  ngOnInit() {
    this.subscription = this.notifierService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
      
      // Auto remove notifications with duration
      if (notification.duration) {
        setTimeout(() => {
          this.onNotificationClosed(notification);
        }, notification.duration);
      }
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  onNotificationClosed(notification: Notification) {
    const index = this.notifications.indexOf(notification);
    if (index >= 0) {
      this.notifications.splice(index, 1);
      this.notifierService.removeNotification(notification);
    }
  }
} 