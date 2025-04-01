import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<div>Processing login...</div>',
  standalone: true
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.authService.handleCallback(params['code']).then(() => {
          // The auth service will handle the redirect to the stored URL
          // If no stored URL exists, it will redirect to home
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
} 