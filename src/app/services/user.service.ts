import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from '../config';
import { User, UserProfileUpdateDto, SellerProfileUpdateDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    constructor(private apiService: ApiService) {}

    getProfile(): Observable<User> {
        return this.apiService.get<User>(`${environment.baseAPIUrl}User/profile`);
    }

    getAllSellers(): Observable<User[]> {
        return this.apiService.get<User[]>(`${environment.baseAPIUrl}User/sellers`);
    }

    updateProfile(profile: UserProfileUpdateDto): Observable<any> {
        return this.apiService.put(`${environment.baseAPIUrl}User/profile`, profile);
    }

    becomeSeller(): Observable<any> {
        return this.apiService.post(`${environment.baseAPIUrl}User/become-seller`, {});
    }

    updateSellerProfile(profile: SellerProfileUpdateDto): Observable<any> {
        return this.apiService.put(`${environment.baseAPIUrl}User/seller-profile`, profile);
    }

    // Admin only endpoints
    verifySeller(userId: string, isVerified: boolean): Observable<any> {
        return this.apiService.put(`${environment.baseAPIUrl}User/verify-seller/${userId}?isVerified=${isVerified}`, null);
    }

    deactivateUser(userId: string): Observable<any> {
        return this.apiService.put(`${environment.baseAPIUrl}User/deactivate/${userId}`, null);
    }
}