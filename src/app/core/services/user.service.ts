import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

import { User, UserProfileUpdateDto, SellerProfileUpdateDto, StoreDetails } from '../models/user.model';
import { environment } from '../../utils/config';

interface BecomeSellerResponse {
  message: string;
  user: User;
}

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

    becomeSeller(storeDetails: StoreDetails): Observable<BecomeSellerResponse> {
        // Create a UserServiceDto structure
        const userDto = {
            sellerProfile: {
                storeName: storeDetails.storeName,
                storeDescription: storeDetails.storeDescription
            }
        };
        return this.apiService.post<BecomeSellerResponse>(`${environment.baseAPIUrl}User/become-seller`, userDto);
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