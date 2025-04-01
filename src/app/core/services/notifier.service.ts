import { Injectable, Inject } from '@angular/core';

import { NotificationType } from '../models/enums/notification-type';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(@Inject('MatSnackBar') private snackBar: any) {}

  showNotification(displayMessage: string, buttonText: string, type: NotificationType = NotificationType.ERROR) {
    const duration = type === NotificationType.ERROR ? undefined : this.calculateDuration(displayMessage);
    this.snackBar.open(displayMessage, buttonText, {
      duration: duration,
      horizontalPosition: 'right', 
      verticalPosition: 'top',
      panelClass: type,
      
    });
  }

  private calculateDuration(message: string): number {
    const baseDuration = 5000;
    const durationPerChar = 100;
    return Math.min(baseDuration + message.length * durationPerChar, 20000);
  }
}