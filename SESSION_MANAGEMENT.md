# Session Management Implementation

This document explains the persistent session management implementation for HackMate.

## Overview

Users now remain logged in even after closing the browser. Sessions persist for 30 days and are automatically verified on app load.

## Backend Changes

### 1. Extended JWT Token Expiration
- **File**: `backend/Controllers/AuthController.js`
- Changed JWT expiration from `2h` to `30d` (30 days)
- Applies to both login and signup flows

### 2. Token Verification Endpoint
- **Route**: `GET /auth/verify`
- **File**: `backend/Controllers/AuthController.js` → `verifyToken()`
- Validates existing tokens and returns user data
- Used by frontend to restore sessions

### 3. Updated Routes
- **File**: `backend/Routes/AuthRouter.js`
- Added new `/auth/verify` endpoint for session validation

## Frontend Changes

### 1. AuthContext Provider
- **File**: `Frontend/src/contexts/AuthContext.jsx`
- Manages global authentication state
- Automatically checks token validity on app mount
- Provides `login()`, `logout()`, and auth status

### 2. ProtectedRoute Component
- **File**: `Frontend/src/components/ProtectedRoute.jsx`
- Wraps protected pages
- Verifies authentication before rendering
- Redirects to login if not authenticated
- Shows loading state during verification

### 3. Updated App.jsx
- **File**: `Frontend/src/App.jsx`
- Wrapped entire app with `<AuthProvider>`
- Added `<ProtectedRoute>` to all authenticated pages:
  - Onboarding pages (/details, /your-info, /skills)
  - Core app pages (/discover, /pending, /selections, /matches, /profile)
  - Chat pages (/chat, /chat/:chatId)

### 4. Updated Login & Signup Pages
- **Files**: 
  - `Frontend/src/Pages/Login.jsx`
  - `Frontend/src/Pages/Signup.jsx`
- Now use `useAuth()` hook for login state management
- Auto-redirect if already authenticated
- Properly manage tokens via AuthContext

### 5. Updated Navbar
- **File**: `Frontend/src/components/Navbar.jsx`
- Logout now uses AuthContext's `logout()` method
- Properly clears all authentication state

## How It Works

### User Login Flow
1. User enters credentials on login page
2. Backend validates and returns JWT with 30-day expiration
3. Frontend stores token in localStorage
4. AuthContext updates global auth state
5. User is redirected to protected pages

### Session Persistence Flow
1. User returns to app (even after closing browser)
2. AuthContext checks for token in localStorage on mount
3. Calls `/auth/verify` to validate token with backend
4. If valid: User stays logged in, data is refreshed
5. If invalid/expired: Token is cleared, redirected to login

### Protected Routes Flow
1. User tries to access a protected page
2. ProtectedRoute checks authentication status
3. If authenticated: Page renders normally
4. If not authenticated: Redirects to /login
5. Shows loading indicator during check

### Logout Flow
1. User clicks logout in Navbar
2. AuthContext clears localStorage (token & user)
3. Updates auth state to logged out
4. Redirects to login page

## Security Features

- ✅ JWT tokens expire after 30 days
- ✅ Tokens are verified on every protected route access
- ✅ Invalid/expired tokens are automatically cleared
- ✅ User is redirected to login if token validation fails
- ✅ All API requests include Authorization header
- ✅ 401/403 responses automatically clear session

## Testing

### Test Session Persistence
1. Login to the app
2. Close the browser completely
3. Reopen the browser and navigate to the app
4. You should remain logged in

### Test Token Expiration
1. Login to the app
2. Manually expire the token (wait 30 days or modify JWT_SECRET)
3. Refresh the page
4. Should be redirected to login

### Test Protected Routes
1. Logout from the app
2. Try to access /discover or /profile directly via URL
3. Should be redirected to /login
4. After login, should be redirected to the attempted page

## Environment Variables

Ensure these are set in your `.env` file:

```env
JWT_SECRET=your_secure_secret_here
```

## Migration Notes

No database changes required. Existing users will need to login once more to get the new 30-day token.

## Future Enhancements

- Implement refresh tokens for enhanced security
- Add "Remember Me" checkbox for user preference
- Add session management dashboard
- Implement device tracking
- Add ability to logout from all devices
