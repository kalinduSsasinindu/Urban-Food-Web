import { Injectable } from '@angular/core';
import { NotificationType } from '../models/enums/notification-type';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  buttonText: string;
  type: NotificationType;
  duration: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();
  
  private activeNotifications: Notification[] = [];
  
  showNotification(message: string, buttonText: string, type: NotificationType = NotificationType.ERROR) {
    const duration = type === NotificationType.ERROR ? null : this.calculateDuration(message);
    
    const notification: Notification = {
      message,
      buttonText,
      type,
      duration
    };
    
    this.activeNotifications.push(notification);
    this.notificationSubject.next(notification);
    
    if (duration) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }
    
    // For immediate feedback in case components aren't subscribed to the notifications$ stream
    console.log(`Notification: ${message} [${type}]`);
  }
  
  removeNotification(notification: Notification) {
    const index = this.activeNotifications.indexOf(notification);
    if (index > -1) {
      this.activeNotifications.splice(index, 1);
    }
  }
  
  clearAll() {
    this.activeNotifications = [];
  }

  private calculateDuration(message: string): number {
    const baseDuration = 5000;
    const durationPerChar = 100;
    return Math.min(baseDuration + message.length * durationPerChar, 20000);
  }
}