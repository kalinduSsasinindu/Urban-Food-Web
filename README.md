# Urban food Frontend 
A modern e-commerce platform frontend built with Angular, providing a seamless shopping experience for both customers and sellers. This project serves as the frontend for the Urban Food platform, complementing the .NET Core backend.

## Project Overview

Urban food is a feature-rich e-commerce platform that provides:
- Intuitive product browsing and search
- Secure checkout process
- Seller dashboard and management
- Order tracking and management
- User profile management
- Product review system

## Tech Stack

### Core Technologies
- Angular 19+
- TypeScript
- RxJS for reactive programming
- Angular Material for UI components
- SCSS for styling

### Key Features
- **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Cross-browser compatibility

- **State Management**
  - NgRx for state management
  - Service-based architecture
  - Reactive forms

- **Authentication**
  - Google OAuth integration
  - JWT token management
  - Role-based access control

- **Performance Optimization**
  - Lazy loading
  - Code splitting
  - Optimized bundle size

## Project Structure

```
src/
├── app/
│   ├── core/              # Core functionality
│   │   ├── auth/         # Authentication
│   │   ├── guards/       # Route guards
│   │   ├── interceptors/ # HTTP interceptors
│   │   ├── models/       # Data models
│   │   ├── services/     # Core services
│   │   └── utils/        # Utility functions
│   │
│   ├── features/         # Feature modules
│   │   ├── shop/        # Shopping features
│   │   ├── seller/      # Seller dashboard
│   │   ├── user/        # User management
│   │   └── admin/       # Admin features
│   │
│   ├── shared/          # Shared components
│   │   ├── components/  # Reusable components
│   │   ├── directives/  # Custom directives
│   │   └── pipes/       # Custom pipes
│   │
│   └── layout/          # Layout components
│
├── assets/              # Static assets
└── environments/        # Environment configurations
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19 or higher)
- .NET Core 8.0 SDK (for backend)
- MongoDB (for backend)
- Oracle Database (optional, for backend)

### Backend Setup
Before running the frontend, you need to set up the backend server. The backend repository is available at [UrbanFood-API](https://github.com/kalinduSsasinindu/UrbanFood-API).

1. Clone the backend repository:
```bash
git clone https://github.com/kalinduSsasinindu/UrbanFood-API.git
cd UrbanFood-API
```

2. Follow the setup instructions in the backend repository's README.md to:
   - Configure the database connections
   - Set up authentication
   - Configure environment variables
   - Start the backend server

3. The backend server should be running on `http://localhost:5000` by default.

### Frontend Setup
1. Clone this repository:
```bash
git clone https://github.com/kalinduSsasinindu/Urban-Food-Web.git
cd Urban-Food-Web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',  // Backend API URL
  googleClientId: 'your-google-client-id'
};
```

4. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for services and components

### Component Structure
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  // Properties
  data$: Observable<any>;

  // Constructor
  constructor(private service: ExampleService) {}

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }

  // Public methods
  public handleAction(): void {
    // Implementation
  }

  // Private methods
  private loadData(): void {
    this.data$ = this.service.getData();
  }
}
```

### State Management
```typescript
// actions
export const loadProducts = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

// reducer
export const productsReducer = createReducer(
  initialState,
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  }))
);
```

## Testing

### Unit Tests
```typescript
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampleComponent ],
      imports: [ HttpClientTestingModule ]
    }).compileComponents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### E2E Tests
```typescript
describe('Shopping Flow', () => {
  it('should complete a purchase', () => {
    cy.visit('/products');
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart').click();
    cy.get('.checkout-button').click();
    cy.get('.payment-form').submit();
    cy.url().should('include', '/order-confirmation');
  });
});
```

## Deployment

### Production Build
```bash
ng build --configuration production
```

### Environment Configuration
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.urbanfood.com',  // Production backend API URL
  googleClientId: 'production-client-id'
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- Implement proper input validation
- Use HTTPS for all API calls
- Sanitize user inputs
- Implement proper error handling
- Follow Angular security best practices

## Performance Optimization

### Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'shop',
    loadChildren: () => import('./features/shop/shop.module')
      .then(m => m.ShopModule)
  }
];
```

### Bundle Optimization
```typescript
// angular.json
{
  "optimization": {
    "scripts": true,
    "styles": true,
    "fonts": true
  }
}
```

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

