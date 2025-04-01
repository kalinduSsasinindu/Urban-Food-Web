import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private accessToken: string = '';

  constructor(private http: HttpClient) {}  

  private createHeaders(headers?: { [key: string]: string }, isSecured: boolean = true): HttpHeaders {
    let httpHeaders = new HttpHeaders();    
   
    let accessToken = sessionStorage.getItem('access_token');
    let clientId = sessionStorage.getItem('client_id');
    let userId = sessionStorage.getItem('user_id');
   
    
    if(userId){
      httpHeaders = httpHeaders.append('UserId', userId);
    }

    if(clientId){
      httpHeaders = httpHeaders.append('ClientId', clientId);
    }



    if (accessToken && isSecured) {
      httpHeaders = httpHeaders.append('Authorization', `Bearer ${accessToken}`);
    }

    if (headers) {
      Object.keys(headers).forEach(key => {
        httpHeaders = httpHeaders.append(key, headers[key]);
      });
    }
    return httpHeaders;
  }

  private createParams(params?: { [key: string]: string }): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return httpParams;
  }

  get<T>(url: string, params?: { [key: string]: string }, headers?: { [key: string]: string }): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.createHeaders(headers),
      params: this.createParams(params)
    });
  }

  post<T>(url: string, body: any, headers?: { [key: string]: string }, isSecured: boolean = true): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: this.createHeaders(headers)
    });
  }

  put<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: this.createHeaders(headers)
    });
  }

  patch<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http.patch<T>(url, body, {
      headers: this.createHeaders(headers)
    });
  }

  delete<T>(url: string, headers?: { [key: string]: string }): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.createHeaders(headers)
    });
  }
}




