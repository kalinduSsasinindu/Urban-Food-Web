# URBANFOOD Frontend (A demo ecommerce platform )

A modern e-commerce platform frontend built with Angular, providing a seamless shopping experience for both customers and sellers. This project serves as the frontend for the URBANFOOD platform, complementing the .NET Core backend.

## Project Context

This project was developed as a coursework assignment for the Database Management module at NIBM. The primary objective was to demonstrate proficiency in:
- Modern frontend architecture and implementation
- Integration with dual-database backend systems
- Responsive and accessible user interface design
- State management in complex applications
- Secure authentication and authorization

> **Note:** This is a work in progress. While the core functionality is implemented, some advanced features and optimizations are still under development.

## Current Implementation Status

### Frontend Implementation
- **Core Module**: Fully implemented with all essential services
  - HTTP interceptors for authentication
  - Route guards for protected routes
  - Models for type-safe data handling
  - Services for API communication

- **Feature Modules**: Mostly implemented
  - Shop module with product browsing and cart functionality
  - User module with profile management
  - Seller module with basic dashboard
  - Admin features partially implemented

### Technical Details
- The project uses Angular's modular architecture
- State management is handled through NgRx
- Reactive programming paradigm with RxJS
- Material Design components for consistent UI
- Lazy loading for optimized performance

## Project Overview

DMCW Frontend is a feature-rich e-commerce platform that provides:
- Intuitive product browsing and search
- Secure checkout process
- Seller dashboard and management
- Order tracking and management
- User profile management
- Product review system

## Technical Insights

### Frontend Architecture
The project implements a modular approach:
- **Core Module**: Essential services and utilities
  - Authentication services
  - HTTP interceptors
  - Global models
  - Core services

- **Feature Modules**: Specific functionality areas
  - Shop module
  - User module
  - Seller module
  - Admin module

### Implementation Challenges
- **State Management**: Maintaining consistent application state
- **Form Validation**: Complex form validation for various inputs
- **Performance Optimization**: Fast loading and interaction
- **Responsive Design**: Consistent experience across devices

### Future Improvements
1. **Real-time Updates**: Implement WebSocket for live notifications
2. **Enhanced Search**: Add advanced filtering and search options
3. **Performance Optimization**: Further bundle size reduction
4. **Accessibility**: Improve for WCAG compliance
5. **Internationalization**: Add multi-language support

## Tech Stack

### Frontend (Angular)
- Angular 19+
- TypeScript
- RxJS for reactive programming
- NgRx for state management
- Angular Material for UI components
- SCSS for styling

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

## Authentication Implementation

### Google OAuth2 Integration

The frontend implements Google OAuth2 integration with the backend authentication system, providing a seamless login experience.

#### Features
- Google OAuth2 client integration
- Secure token storage
- Automatic token refresh
- Auth guards for protected routes
- Role-based UI rendering

#### Implementation Details
1. **Configuration**
   - Environment variables for API URL and client ID
   - Secure storage mechanisms for tokens
   - HTTP interceptors for request authorization

2. **Authentication Flow**
   - User clicks "Sign in with Google"
   - Redirected to Google consent screen
   - After consent, Google redirects back with authorization code
   - Frontend exchanges code for tokens via backend
   - JWT token stored securely in browser
   - Subsequent requests include token

3. **Token Management**
   - Secure token storage in browser
   - Token expiration handling
   - Automatic token refresh
   - Logout functionality

4. **Route Protection**
   - Auth guards for protected routes
   - Role-based access control
   - Redirect to login when unauthorized
   - Preserve requested URL for post-login redirect

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

2. Create a new `appsettings.Development.json` file in the DMCW.API project with your actual configuration values:
```json
{
  "ConnectionStrings": {
    "MongoDB": "your-mongodb-connection-string",
    "DatabaseName": "your-database-name",
    "OracleDB": "your-oracle-connection-string"
  },
  "Authentication": {
    "Google": {
      "ClientId": "your-google-client-id",
      "ClientSecret": "your-google-client-secret",
      "WebRedirectLocalUrl": "http://localhost:4200/",
      "WebRedirectUrl": "http://localhost:4200/"
    }
  },
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  }
}
```

3. Make sure to add `appsettings.Development.json` to your `.gitignore` file to keep your credentials secure.

4. Run the backend application:
```bash
cd DMCW.API
dotnet run
```
The backend server should be running on `http://localhost:5000` by default.

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
Create `src/environments/environment.ts` with the following configuration:
- API URL (e.g., http://localhost:5000)
- Google Client ID
- Other environment-specific variables

4. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Key Features Implementation

### Shopping Cart
The shopping cart implementation includes:
- Add/remove items functionality
- Quantity adjustments
- Persistent cart storage
- Real-time total calculation
- Checkout process integration

### Order Processing
The order processing system provides:
- Order creation from cart items
- Shipping information management
- Payment method integration
- Order history tracking
- Order status monitoring
- Cancellation capabilities

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for services and components

### Component Structure
- Organized by feature modules
- Separation of concerns (components, services, models)
- Smart/container and dumb/presentational components pattern
- OnPush change detection for performance
- Reactive form implementation

## Security Considerations

- Implement proper input validation
- Use HTTPS for all API calls
- Sanitize user inputs
- Store authentication tokens securely
- Implement CSRF protection
- Follow Angular security best practices
- Use Content Security Policy (CSP)
- Regular security audits

## Performance Optimization

### Lazy Loading
- Feature modules loaded on demand
- Preloading strategies for better UX
- Route-based code splitting

### Bundle Optimization
- Tree shaking to remove unused code
- Minification and compression
- Ahead-of-Time compilation
- Component-level code splitting
- Image optimization

## Testing

### Unit Tests
- Services and components testing
- Isolated tests with mocks and stubs
- Testing observables and asynchronous code
- Coverage reports

### E2E Tests
- Critical user flows testing
- Form submission testing
- Navigation testing
- Authentication flow testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

