# Authentication Test Credentials

Use these credentials to test the authentication system:

**Email:** user@nextmail.com  
**Password:** 123456

## How to test:

1. Go to http://localhost:3000
2. Click "Log in" button
3. Enter the credentials above
4. You should be redirected to the dashboard
5. Click "Sign Out" in the sidebar to log out

## Features implemented:

✅ **Login Form** - Located at `/login`  
✅ **Credential Authentication** - Uses the provided test credentials  
✅ **Dashboard Protection** - Requires authentication to access `/dashboard`  
✅ **Sign Out** - Available in the dashboard sidebar  
✅ **Route Protection** - Middleware protects dashboard routes  
✅ **Automatic Redirects** - Logged-in users redirected to dashboard

## File locations:

- **Auth config:** `auth.ts`
- **Auth actions:** `app/lib/actions.ts`
- **Login form:** `app/ui/login-form.tsx`
- **Middleware:** `middleware.ts`
- **Environment:** `.env.local`
