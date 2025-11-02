# FinWise Full-Stack Integration Guide

## 🔐 JWT Authentication & Secured API Routes

This project now features complete JWT-based authentication with secure backend routes and seamless frontend integration.

## 🏗️ Architecture Overview

```
┌─────────────────┐     HTTP Requests    ┌─────────────────┐
│   Frontend      │────────────────────→│   Backend       │
│   (TypeScript)  │                     │   (JavaScript)  │
│   Port: 5173    │←────────────────────│   Port: 5001    │
└─────────────────┘     JSON Responses   └─────────────────┘
        │                                        │
        │                                        │
        ▼                                        ▼
┌─────────────────┐                     ┌─────────────────┐
│   Browser       │                     │   MongoDB       │
│   LocalStorage  │                     │   Database      │
│   (JWT Tokens)  │                     │   (User Data)   │
└─────────────────┘                     └─────────────────┘
```

## 🚀 Getting Started

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
Server will run on: http://localhost:5001

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

## 🔑 Authentication Flow

### JWT Token Management
- **Access Token**: Short-lived (15 minutes), stored in localStorage
- **Refresh Token**: Long-lived (7 days), stored as HTTP-only cookie
- **Automatic Refresh**: Frontend automatically refreshes expired tokens

### Authentication States
```typescript
// User logged in
{
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "user_id",
    email: "user@example.com",
    name: "User Name",
    role: "user",
    kycStatus: "pending"
  }
}

// User not logged in
{
  accessToken: null,
  user: null
}
```

## 🛡️ API Security Levels

### 1. Public Routes (No Authentication Required)
- `GET /health` - Health check
- `GET /api` - API information

### 2. Optional Authentication Routes
- `GET /api/market` - Market data (personalized if logged in)
- `GET /api/news` - News feed (personalized if logged in)

### 3. Protected Routes (Authentication Required)
- `GET /api/me/profile` - User profile
- `PUT /api/me/profile` - Update profile
- `GET /api/portfolio` - User portfolio
- `GET /api/goals` - User goals
- `GET /api/accounts` - Linked accounts

### 4. Admin Routes (Admin Role Required)
- `GET /api/admin` - Admin dashboard
- All admin-specific endpoints

### 5. Auth Routes (Rate Limited)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

## 🧪 API Testing

### Frontend API Tester
Visit: http://localhost:5173/api-test

Features:
- Test all API endpoints
- Automatic authentication handling
- Real-time response display
- Backend health monitoring
- Comprehensive error handling

### Manual Testing with PowerShell

#### Test Public Endpoint
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/health" -Method Get
```

#### Test Protected Endpoint (Should Fail)
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/me/profile" -Method Get
```

#### Register New User
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## 🔧 Frontend Services

### AuthService
```typescript
import { authService } from './services/api';

// Login
const response = await authService.login(email, password);
if (response.success) {
  // User is now logged in, token stored automatically
}

// Get current user
const userResponse = await authService.getCurrentUser();
```

### Protected Resource Services
```typescript
import { portfolioService, goalsService } from './services/api';

// These automatically include JWT token in requests
const portfolio = await portfolioService.getPortfolio();
const goals = await goalsService.getGoals();
```

## 🔒 Security Features

### Backend Security
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API and auth-specific rate limits
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Zod schema validation
- **Password Hashing**: Bcrypt with salt rounds
- **Helmet Security**: Security headers
- **Error Handling**: Secure error responses

### Frontend Security
- **Token Storage**: Secure localStorage management
- **Automatic Refresh**: Handle expired tokens
- **Request Interceptors**: Automatic auth headers
- **Route Protection**: Auth-based route access
- **Error Boundaries**: Graceful error handling

## 📊 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/finwise
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_API_HEALTH_URL=http://localhost:5001/health
VITE_BACKEND_URL=http://localhost:5001
VITE_AUTH_LOGIN_URL=http://localhost:5001/api/auth/login
VITE_AUTH_REGISTER_URL=http://localhost:5001/api/auth/register
VITE_AUTH_REFRESH_URL=http://localhost:5001/api/auth/refresh
VITE_AUTH_LOGOUT_URL=http://localhost:5001/api/auth/logout
```

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name"
    }
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Authentication Failed",
  "message": "Invalid credentials"
}
```

## 🚨 Error Handling

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Frontend Error Handling
```typescript
const response = await apiService.someEndpoint();
if (!response.success) {
  console.error('API Error:', response.error);
  // Handle error appropriately
}
```

## 🧪 Development Workflow

1. **Start Backend**: `npm start` in backend directory
2. **Start Frontend**: `npm run dev` in frontend directory
3. **Visit API Tester**: http://localhost:5173/api-test
4. **Test Authentication**: Register/login through frontend
5. **Test Endpoints**: Use API tester to verify all routes
6. **Monitor Console**: Check browser/server logs for issues

## 📈 Next Steps

Now that authentication is fully integrated, you can:

1. **Build Features**: Implement actual business logic in routes
2. **Add Models**: Create MongoDB schemas for your data
3. **Expand APIs**: Add more endpoints for your features
4. **Add Testing**: Write unit and integration tests
5. **Deploy**: Set up production deployment

## 📚 Key Files

### Backend
- `src/middleware/auth.js` - JWT authentication middleware
- `src/routes/auth.js` - Authentication routes
- `src/routes/user.js` - User profile routes (protected)
- `src/services/` - Business logic services

### Frontend
- `src/services/api.ts` - HTTP client and API services
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/components/ApiTester.tsx` - API testing dashboard
- `src/pages/Login.tsx` - Login page with backend integration

Your full-stack application is now ready for development with secure JWT authentication! 🎉