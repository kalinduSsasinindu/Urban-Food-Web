import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth/auth.service';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NotificationContainerComponent } from './shared/components/notifications/notification-container/notification-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    CommonModule, 
    NavbarComponent,
    NotificationContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Handle OAuth callback if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
      this.authService.handleCallback();
    }
  }
}
