import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { fromByteArray } from 'base64-js';
import { sha256 } from 'js-sha256';
import { User } from '../../models/user.model';
import { ApiService } from '../api.service';
import { BehaviorSubject, catchError, firstValueFrom, throwError } from 'rxjs';
import { environment } from '../../config';
import { ExchangeCodeRequest } from '../../models/exchangecode-request.model';
import { TokenResponse } from '../../models/token-response.model';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private codeVerifier!: string;
  public clientIdSubject = new BehaviorSubject<string>(this.getClientIdFromLocalStorage());
  clientId$ = this.clientIdSubject.asObservable();
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'expires_at';
  private readonly CLIENT_ID_KEY = 'client_id';
  private readonly REDIRECT_URL_KEY = 'auth_redirect_url';

  constructor(private apiService: ApiService, private router: Router, private userService: UserService) { }

  getClientIdFromLocalStorage(): string {
    return localStorage.getItem('client_id') || '';
  }


  private generateRandomString(length: number): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private base64UrlEncode(str: Uint8Array): string {
    return fromByteArray(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Function to generate the code challenge from the code verifier
  private generateCodeChallenge(codeVerifier: string): string {
    const hash = sha256.array(codeVerifier);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  public async login(): Promise<void> {
    // Store the current URL before redirecting
    const currentUrl = window.location.pathname;
    if (currentUrl !== '/login') {
      sessionStorage.setItem(this.REDIRECT_URL_KEY, currentUrl);
    }
    
    this.codeVerifier = this.generateRandomString(128);
    const codeChallenge = this.generateCodeChallenge(this.codeVerifier);
    sessionStorage.setItem('code_verifier', this.codeVerifier);

    const clientId =
      environment.clientId;
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    const responseType = 'code';
    const scope = encodeURIComponent('openid profile email');
    const state = this.generateRandomString(16);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  }

  logout() {
    // Clear all auth-related data
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.EXPIRES_AT_KEY);
    sessionStorage.removeItem(this.CLIENT_ID_KEY);
    sessionStorage.removeItem(this.REDIRECT_URL_KEY);

    // Redirect to home page
    this.router.navigate(['/']);
  }

  public async handleCallback(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code && state) {
      await this.exchangeCodeForToken(code);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<void> {
    const bodyParams: ExchangeCodeRequest = {
      AuthCode: code,
      CodeVerifier: sessionStorage.getItem('code_verifier'),
      IsMobile: false,
    };

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(
        this.apiService
          .post<TokenResponse>(
            `${environment.baseAPIUrl}Authentication/exchange-code`,
            bodyParams,
            undefined,
            false
          )
          .pipe(
            catchError((error) => {
              console.error('Error occurred:', error);
              return throwError(() => new Error('Token exchange failed'));
            })
          )
      );

      const { access_token, id_token, refresh_token, expires_in } = tokenResponse;

      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('id_token', id_token);
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('expires_at', (Date.now() + expires_in * 1000).toString());

      // Get user profile after successful token exchange
      const userProfile = await firstValueFrom(this.userService.getProfile());
      if (userProfile?.clientId) {
        sessionStorage.setItem('client_id', userProfile.clientId);
        this.clientIdSubject.next(userProfile.clientId);
      }

      // Redirect to appropriate profile based on user role
      if (userProfile?.userRole === 'Seller') {
        this.router.navigate(['/seller-profile']);
      } else {
        this.router.navigate(['/customer-profile']);
      }
    } catch (error) {
      console.error('Error during token exchange:', error);
      this.router.navigate(['/login']);
    }
  }

  public async refreshToken(): Promise<string | null> {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    try {
      const bodyParams = {
        refreshtoken: refreshToken,
        grant_type: 'refresh_token',
        client_id: environment.clientId
      };

      const tokenResponse: TokenResponse = await firstValueFrom(
        this.apiService
          .post<TokenResponse>(
            `${environment.baseAPIUrl}Authentication/refresh-token`,
            bodyParams,
            undefined,
            false
          )
          .pipe(
            catchError((error) => {
              console.error('Error occurred:', error);
              return throwError(() => new Error('Token refresh failed'));
            })
          )
      );

      const { access_token, id_token, expires_in } = tokenResponse;

      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('id_token', id_token);
      sessionStorage.setItem('expires_at', (Date.now() + expires_in * 1000).toString());

      return access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  private async ensureValidToken(): Promise<void> {
    const expiresAt = sessionStorage.getItem('expires_at');
    if (expiresAt && Date.now() > Number(expiresAt)) {
      await this.refreshToken();
    }
  }

  getRedirectUrl(): string | null {
    return sessionStorage.getItem(this.REDIRECT_URL_KEY);
  }

  clearRedirectUrl() {
    sessionStorage.removeItem(this.REDIRECT_URL_KEY);
  }
}
