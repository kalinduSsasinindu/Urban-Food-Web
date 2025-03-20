import { Injectable, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierComponent } from '../components/notifier/notifier.component';
import { NotificationType } from '../models/enums/notification-type';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(@Inject(MatSnackBar) private snackBar: MatSnackBar) {}

  showNotification(displayMessage: string, buttonText: string, type: NotificationType = NotificationType.ERROR) {
    const duration = type === NotificationType.ERROR ? undefined : this.calculateDuration(displayMessage);
    
    this.snackBar.openFromComponent(NotifierComponent, {
      data: { message: displayMessage, buttonText: buttonText, type: type },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type,
      duration: duration,
    });
  }

  private calculateDuration(message: string): number {
    const baseDuration = 5000;
    const durationPerChar = 100;
    return Math.min(baseDuration + message.length * durationPerChar, 20000);
  }
}