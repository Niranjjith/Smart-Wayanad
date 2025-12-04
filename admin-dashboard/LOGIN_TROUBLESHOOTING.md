# 🔧 Admin Login Troubleshooting Guide

## ✅ Fixed Issues

1. **Removed undefined `setIsLoading` call** - Now uses AuthContext loading state
2. **Improved error handling** - Better error messages and connection detection
3. **Enhanced AuthContext** - Better response handling and token management

## 🔍 Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Solution:**
- Make sure the backend server is running on `http://localhost:5000`
- Check if MongoDB is running
- Verify CORS settings in backend

### Issue 2: "User not found" or "Invalid credentials"
**Solution:**
- The backend automatically creates an admin user on startup
- Default credentials (from `.env`):
  - Email: `admin@smartwayanad.com` (or value from ADMIN_EMAIL)
  - Password: Value from ADMIN_PASSWORD in `.env`
- If using default, check `backend/.env` file

### Issue 3: Login succeeds but doesn't redirect
**Solution:**
- Check browser console for errors
- Verify ProtectedRoute is working
- Check if token is being stored in localStorage

## 🚀 Quick Fix Steps

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check Backend is Running:**
   - Visit: http://localhost:5000
   - Should see: "🚀 Smart Wayanad Backend Running & Connected..."

3. **Verify Admin User Exists:**
   - Check backend console for: "✅ Admin ensured: [email]"
   - Or manually create via MongoDB

4. **Check Environment Variables:**
   ```env
   ADMIN_EMAIL=admin@smartwayanad.com
   ADMIN_PASSWORD=your_password_here
   ```

5. **Clear Browser Storage:**
   - Open DevTools → Application → Local Storage
   - Clear all items
   - Try login again

## 📝 Default Test Credentials

If using default setup:
- **Email:** `admin@gmail.com` (pre-filled in login form)
- **Password:** `123456` (pre-filled in login form)

**Note:** These are the default values in the login form. Actual credentials depend on your `.env` file.

## 🔐 Creating Admin User Manually

If admin user doesn't exist, you can create it via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Administrator",
    "email": "admin@gmail.com",
    "password": "123456"
  }'
```

## 🐛 Debug Steps

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the `/api/auth/login` request:
   - Status code
   - Response body
   - Request payload

5. Check Console tab for errors

## ✅ Expected Behavior

1. Enter credentials
2. Click "Sign In"
3. Button shows loading spinner
4. Success toast appears: "✅ Login successful"
5. Redirects to Dashboard
6. Token stored in localStorage

## 📞 Still Having Issues?

Check:
- ✅ Backend server is running
- ✅ MongoDB is connected
- ✅ CORS is configured correctly
- ✅ Environment variables are set
- ✅ No console errors
- ✅ Network tab shows successful API call




