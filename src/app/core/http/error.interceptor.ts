import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, from, Observable, switchMap, take, throwError } from 'rxjs';
import { NotificationType } from '../models';
import { AuthService } from '../auth';
import { NotifierService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private notifierService: NotifierService,
        private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return this.handle401Error(request, next);
                }

                // Show error notification for all other errors
                const errorMessage = this.handleErrorResponse(error);
                if (errorMessage) {
                    this.notifierService.showNotification(
                        errorMessage,
                        'OK',
                        NotificationType.ERROR
                    );
                }

                return throwError(() => error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return from(this.authService.refreshToken()).pipe(
                switchMap((newToken: string | null) => {
                    this.isRefreshing = false;

                    if (newToken) {
                        this.refreshTokenSubject.next(newToken);
                        return next.handle(this.addTokenToRequest(request, newToken));
                    } else {
                        this.authService.logout();
                        return throwError(() => new Error('Token refresh failed'));
                    }
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    this.authService.logout();
                    return throwError(() => err);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => next.handle(this.addTokenToRequest(request, token)))
            );
        }
    }

    private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handleErrorResponse(error: HttpErrorResponse): string {
        if (!error.error) {
            return 'An unexpected error occurred';
        }

        if (typeof error.error === 'string') {
            return error.error;
        }

        if (error.error.errors) {
            const errorMessages = Object.values(error.error.errors)
                .flat()
                .join(' ');
            return errorMessages || 'Validation error occurred';
        }

        if (error.error.message) {
            return error.error.message;
        }

        return error.message || 'An unexpected error occurred';
    }
}
