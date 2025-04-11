import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { Order, ShippingAddress, LineItem, PaymentOptions } from '../../../../core/models/order.model';
import { Cart } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      
      <div class="checkout-content" *ngIf="cart && cart.items.length > 0; else emptyCart">
        <div class="checkout-form">
          <div class="checkout-section">
            <h2>Shipping Information</h2>
            <form [formGroup]="shippingForm">
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" formControlName="fullName" class="form-control">
                <div class="error-message" *ngIf="shippingForm.get('fullName')?.invalid && shippingForm.get('fullName')?.touched">
                  Full name is required
                </div>
              </div>

              <div class="form-group">
                <label for="street">Street Address</label>
                <input type="text" id="street" formControlName="street" class="form-control">
                <div class="error-message" *ngIf="shippingForm.get('street')?.invalid && shippingForm.get('street')?.touched">
                  Street address is required
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">City</label>
                  <input type="text" id="city" formControlName="city" class="form-control">
                  <div class="error-message" *ngIf="shippingForm.get('city')?.invalid && shippingForm.get('city')?.touched">
                    City is required
                  </div>
                </div>

                <div class="form-group">
                  <label for="postalCode">Postal Code</label>
                  <input type="text" id="postalCode" formControlName="postalCode" class="form-control">
                  <div class="error-message" *ngIf="shippingForm.get('postalCode')?.invalid && shippingForm.get('postalCode')?.touched">
                    Postal code is required
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control">
                <div class="error-message" *ngIf="shippingForm.get('phone')?.invalid && shippingForm.get('phone')?.touched">
                  Valid phone number is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email" class="form-control">
                <div class="error-message" *ngIf="shippingForm.get('email')?.invalid && shippingForm.get('email')?.touched">
                  Valid email is required
                </div>
              </div>
            </form>
          </div>

          <div class="checkout-section">
            <h2>Payment Method</h2>
            <form [formGroup]="paymentForm">
              <div class="payment-options">
                <div class="payment-option" [class.selected]="paymentForm.get('paymentMethod')?.value === 'CASH_ON_DELIVERY'">
                  <input 
                    type="radio" 
                    id="cashOnDelivery" 
                    value="CASH_ON_DELIVERY" 
                    formControlName="paymentMethod"
                  >
                  <label for="cashOnDelivery">Cash on Delivery</label>
                </div>

                <div class="payment-option" [class.selected]="paymentForm.get('paymentMethod')?.value === 'BANK_TRANSFER'">
                  <input 
                    type="radio" 
                    id="bankTransfer" 
                    value="BANK_TRANSFER" 
                    formControlName="paymentMethod"
                  >
                  <label for="bankTransfer">Bank Transfer</label>
                </div>

                <div class="payment-option" [class.selected]="paymentForm.get('paymentMethod')?.value === 'CREDIT_CARD'" [class.disabled]="true">
                  <input 
                    type="radio" 
                    id="creditCard" 
                    value="CREDIT_CARD" 
                    formControlName="paymentMethod"
                    [disabled]="true"
                  >
                  <label for="creditCard">Credit Card (Coming soon)</label>
                </div>
              </div>
            </form>
          </div>

          <div class="checkout-section" *ngIf="paymentForm.get('paymentMethod')?.value === 'BANK_TRANSFER'">
            <h3>Bank Transfer Details</h3>
            <div class="bank-details">
              <p><strong>Bank:</strong> People's Bank</p>
              <p><strong>Account Name:</strong> Urban Food Web</p>
              <p><strong>Account Number:</strong> 123-456-789-10</p>
              <p><strong>Branch:</strong> Colombo Main</p>
              <p><strong>Reference:</strong> Your Order Number (will be provided after order placement)</p>
              <p class="note">Please note: Your order will be processed after payment confirmation.</p>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cart.items">
              <div class="item-details">
                <h3>{{item.title}}</h3>
                <p *ngIf="item.variantTitle">{{item.variantTitle}}</p>
                <div class="item-quantity">Qty: {{item.quantity}}</div>
              </div>
              <div class="item-price">
                LKR{{(item.price * item.quantity).toFixed(2)}}
              </div>
            </div>
          </div>

          <div class="summary-details">
            <div class="summary-item">
              <span>Subtotal</span>
              <span>LKR{{cart.subtotal.toFixed(2)}}</span>
            </div>
            <div class="summary-item">
              <span>Shipping</span>
              <span>LKR{{cart.shippingCost.toFixed(2)}}</span>
            </div>
            <div class="summary-item" *ngIf="cart.discount > 0">
              <span>Discount</span>
              <span>-LKR{{cart.discount.toFixed(2)}}</span>
            </div>
            <div class="summary-item">
              <span>Tax</span>
              <span>LKR{{cart.tax.toFixed(2)}}</span>
            </div>
            <div class="summary-item total">
              <span>Total</span>
              <span>LKR{{cart.total.toFixed(2)}}</span>
            </div>
          </div>

          <div class="actions">
            <button class="place-order-btn" [disabled]="!isFormValid()" (click)="placeOrder()">
              Place Order
            </button>
            <button class="back-btn" routerLink="/cart">
              Back to Cart
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart">
          <i class="fas fa-shopping-cart empty-cart-icon"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button class="continue-shopping-btn" routerLink="/shop">Continue Shopping</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
    }

    .checkout-form, .order-summary {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .checkout-section {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .checkout-section:last-child {
      border-bottom: none;
    }

    h2 {
      color: #333;
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
    }

    h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-option {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .payment-option.selected {
      border-color: #3498db;
      background-color: #f1f9ff;
    }

    .payment-option.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .payment-option input {
      margin-right: 0.8rem;
    }

    .bank-details {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .bank-details p {
      margin: 0.5rem 0;
    }

    .bank-details .note {
      font-style: italic;
      color: #888;
      margin-top: 1rem;
    }

    .order-summary {
      padding: 1.5rem;
      height: fit-content;
    }

    .cart-items {
      margin-bottom: 1.5rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-details h3 {
      margin: 0 0 0.3rem;
      font-size: 1rem;
    }

    .item-details p {
      color: #777;
      margin: 0 0 0.3rem;
      font-size: 0.9rem;
    }

    .item-quantity {
      color: #555;
      font-size: 0.9rem;
    }

    .item-price {
      font-weight: 500;
    }

    .summary-details {
      margin-top: 1.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      color: #555;
    }

    .summary-item.total {
      font-weight: bold;
      color: #333;
      font-size: 1.2rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .actions {
      margin-top: 1.5rem;
    }

    .place-order-btn {
      width: 100%;
      padding: 1rem;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .place-order-btn:hover {
      background-color: #27ae60;
    }

    .place-order-btn:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .back-btn {
      width: 100%;
      padding: 0.8rem;
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    .empty-cart {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-cart-icon {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .continue-shopping-btn {
      padding: 0.8rem 1.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  isProcessing = false;
  userProfile: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.shippingForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['CASH_ON_DELIVERY', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    // Load user profile to prefill shipping information
    if (this.authService.isLoggedIn()) {
      this.userService.getProfile().subscribe({
        next: (user) => {
          this.userProfile = user;
          
          // Pre-fill form with user data if available
          if (user) {
            this.shippingForm.patchValue({
              fullName: user.name,
              email: user.email,
              phone: user.phone
            });

            // If user has address information
            if (user.address) {
              this.shippingForm.patchValue({
                street: user.address.street,
                city: user.address.city,
                postalCode: user.address.zipCode
              });
            }
          }
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.shippingForm.valid && this.paymentForm.valid && !this.isProcessing && !!this.cart && this.cart.items.length > 0;
  }

  placeOrder(): void {
    if (!this.isFormValid() || !this.cart) {
      return;
    }

    this.isProcessing = true;

    // Extract shipping information
    const shippingInfo = this.shippingForm.value;
    const paymentMethod: string = this.paymentForm.get('paymentMethod')?.value;

    // Parse name into first and last name
    const nameParts = shippingInfo.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create order object
    
    const order: Order = {
        id: '', // Empty string for new order

      financialStatus: 'PENDING',
      fulfillmentStatus: 'UNFULFILLED',
      name: `Order #${new Date().getTime()}`,
      note: '',
      paymentMethod: [paymentMethod],
      phone: shippingInfo.phone,
      subtotalPrice: this.cart.subtotal,
      totalLineItemsPrice: this.cart.subtotal,
      totalPrice: this.cart.total,
      totalShippingPrice: this.cart.shippingCost,
      totalDiscountPrice: this.cart.discount,
      shippingAddress: {
        firstName: firstName,
        lastName: lastName,
        phone: shippingInfo.phone,
        address1: shippingInfo.street,
        city: shippingInfo.city
      },
      customer: {
        email: shippingInfo.email,
        firstName: firstName,
        lastName: lastName,
        phone: shippingInfo.phone
      },
      lineItems: this.cart.items.map(item => {
        return {
          fulfillableQuantity: item.quantity,
          fulfillmentStatus: 'UNFULFILLED',
          name: item.title,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
          title: item.title,
          variantTitle: item.variantTitle || '',
          imageUrl: item.imageUrl,
          variantId: parseInt(item.variantId.toString()),
          sellerId: item.sellerId || sessionStorage.getItem('client_id') || "unknown-seller",
          sellerName: item.sellerName || "Unknown Seller"
        } as LineItem;
      }),
      paymentInfo: {
        paymentOption: paymentMethod,
        paid: paymentMethod !== 'CASH_ON_DELIVERY',
        totalPaidAmount: paymentMethod !== 'CASH_ON_DELIVERY' ? 0 : 0
      },
      isCancelled: false,
      
      timeLineDetails: [],
      tags: []
    };

    // Transform order to match backend expectations
    const orderRequestBody = this.createOrderRequestBody(order);
    console.log('Sending order data:', orderRequestBody);

    this.orderService.createOrder(orderRequestBody).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        // Clear the cart
        this.cartService.clearCart();
        
        // Redirect to confirmation page
        this.router.navigate(['/order-confirmation', response.id]);
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error creating order:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        alert('There was a problem creating your order. Please try again.');
        this.isProcessing = false;
      }
    });
  }

  private createOrderRequestBody(order: Order): any {
    // Create a structure exactly matching the backend expectations
    const requestBody: any = {
      // Basic info - using string values as shown in the expected model
      financialStatus: "string",
      fulfillmentStatus: "string",
      name: "string", // Will be generated by backend
      note: "string",
      paymentMethod: [
        "string"
      ],
      phone: order.phone || "string",
      subtotalPrice: order.subtotalPrice,
      totalLineItemsPrice: order.totalLineItemsPrice,
      totalPrice: order.totalPrice,
      totalShippingPrice: order.totalShippingPrice,
      totalDiscountPrice: order.totalDiscountPrice,
      
      // Address
      shippingAddress: {
        firstName: order.shippingAddress.firstName || "string",
        lastName: order.shippingAddress.lastName || "string",
        phone: order.shippingAddress.phone || "string",
        address1: order.shippingAddress.address1 || "string",
        address2: "string",
        city: order.shippingAddress.city || "string"
      },
      
      // Customer
      customer: {
        email: order.customer.email || "string",
        firstName: order.customer.firstName || "string",
        lastName: order.customer.lastName || "string",
        phone: order.customer.phone || "string"
      },
      
      // Line items
      lineItems: order.lineItems.map(item => ({
        fulfillableQuantity: item.fulfillableQuantity || 0,
        fulfillmentStatus: "string",
        name: item.name || "string",
        price: item.price || 0,
        productId: item.productId || "string",
        quantity: item.quantity || 0,
        title: item.title || "string",
        variantTitle: item.variantTitle || "string",
        imageUrl: item.imageUrl || "string",
        variantId: item.variantId || 0,
        sellerId: item.sellerId || sessionStorage.getItem('client_id') || "unknown-seller",
        sellerName: item.sellerName || "Unknown Seller"
      })),
      
      // Payment info - exactly matching backend structure
      paymentInfo: {
        payments: [
          {
            paymentMethod: "string",
            amount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      },
      
      isCancelled: true,
      
      // Timeline
      timeLineDetails: [
        {
          createdAt: new Date().toISOString(),
          comment: "string",
          images: [
            "string"
          ],
          imgUrls: [
            "string"
          ]
        }
      ],
      
      tags: [
        "string"
      ]
    };
    
    // Add clientId
    const clientId = sessionStorage.getItem('client_id');
    if (clientId) {
      requestBody.clientId = clientId;
    } else {
      requestBody.clientId = "string";
    }
    
    // Replace placeholder values with actual values from the order
    // for required fields while maintaining the expected structure
    if (order.paymentMethod && order.paymentMethod.length > 0) {
      requestBody.paymentMethod = [order.paymentMethod[0]];
      if (requestBody.paymentInfo && requestBody.paymentInfo.payments && 
          requestBody.paymentInfo.payments.length > 0) {
        requestBody.paymentInfo.payments[0].paymentMethod = order.paymentMethod[0];
      }
    }
    
    return requestBody;
  }
} 