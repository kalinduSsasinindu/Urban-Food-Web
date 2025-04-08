import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../utils/config';
import { Order, OrderSearchResponse, TimeLineDetails, ShippingAddress, LineItem, PaymentInfo, OrderPaymentWebDto } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.baseAPIUrl}Order`;

  constructor(private apiService: ApiService) {}

  getOrders(): Observable<OrderSearchResponse[]> {
    return this.apiService.get<OrderSearchResponse[]>(this.apiUrl);
  }

  getOrdersByStatus(fulfillmentStatus: string): Observable<OrderSearchResponse[]> {
    return this.apiService.get<OrderSearchResponse[]>(`${this.apiUrl}/GetOrdersByStatus/${fulfillmentStatus}`);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.apiService.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  createOrder(order: Order): Observable<{ id: string }> {
    return this.apiService.post<{ id: string }>(this.apiUrl, order);
  }

  addTimelineEntry(orderId: string, timelineDetails: TimeLineDetails): Observable<any> {
    return this.apiService.patch<any>(`${this.apiUrl}/${orderId}/timeline`, timelineDetails);
  }

  updateOrderLineItems(orderId: string, lineItems: LineItem[]): Observable<any> {
    return this.apiService.patch<any>(`${this.apiUrl}/${orderId}/lineItems`, lineItems);
  }

  updateShippingAddress(orderId: string, shippingAddress: ShippingAddress): Observable<any> {
    return this.apiService.patch<any>(`${this.apiUrl}/${orderId}/shippingAddress`, shippingAddress);
  }

  updatePaymentInfo(orderId: string, paymentInfo: PaymentInfo): Observable<any> {
    return this.apiService.patch<any>(`${this.apiUrl}/${orderId}/paymentInfo`, paymentInfo);
  }

  updatePaymentAmounts(orderId: string, paymentAmounts: OrderPaymentWebDto): Observable<any> {
    return this.apiService.patch<any>(`${this.apiUrl}/${orderId}/paymentAmounts`, paymentAmounts);
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.apiService.put<any>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.apiService.delete<any>(`${this.apiUrl}/${orderId}`);
  }

  searchOrders(query?: string): Observable<OrderSearchResponse[]> {
    const params: { [key: string]: string } = {};
    if (query) {
      params['query'] = query;
    }
    return this.apiService.get<OrderSearchResponse[]>(`${this.apiUrl}/order`, params);
  }

  addTagToOrder(orderId: string, tagNames: string[]): Observable<any> {
    return this.apiService.post<any>(`${this.apiUrl}/${orderId}/add-tag`, tagNames);
  }
} 