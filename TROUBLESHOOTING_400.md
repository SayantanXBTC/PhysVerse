# Troubleshooting 400 Bad Request Error

## What 400 Means

A 400 error means the server received your request but rejected it because:
- Missing required fields
- Invalid data format
- Validation failed

## Quick Fixes

### For Registration (/api/auth/register)

**Required fields:**
- `name` (string, 2-50 characters)
- `email` (valid email format)
- `password` (string, 6-100 characters)

**Check your form:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Click on the failed request
5. Check "Payload" or "Request" tab

**Expected payload:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### For Login (/api/auth/login)

**Required fields:**
- `email` (valid email)
- `password` (string, min 1 character)

**Expected payload:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## Debug Steps

### Step 1: Check Backend Logs

Look at your backend terminal. You should see error details like:

```
Validation failed
{
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

### Step 2: Check Browser Console

Open DevTools Console (F12) and look for error messages.

### Step 3: Test with curl

**Test Registration:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Expected 400 Error:**
```json
{
  "error": "Validation failed",
  "details": [...]
}
```

## Common Issues

### Issue 1: Email Already Registered

**Error:** `Email already registered`

**Solution:** Use a different email or delete the user from MongoDB:

```bash
mongosh
use physverse
db.users.deleteOne({ email: "test@example.com" })
```

### Issue 2: Password Too Short

**Error:** `String must contain at least 6 character(s)`

**Solution:** Use a password with 6+ characters

### Issue 3: Invalid Email Format

**Error:** `Invalid email`

**Solution:** Use proper email format: `user@domain.com`

### Issue 4: Missing Fields

**Error:** `Required`

**Solution:** Ensure all required fields are sent

## Check Form Data

Add this to your signup/login page to debug:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Debug: Log what's being sent
  console.log('Sending:', { name, email, password });
  
  // Your existing mutation code
  mutation.mutate();
};
```

## Verify Backend Validation

The backend uses Zod schemas. Check if your data matches:

**Registration Schema:**
```typescript
{
  name: string (min: 2, max: 50),
  email: string (valid email),
  password: string (min: 6, max: 100)
}
```

**Login Schema:**
```typescript
{
  email: string (valid email),
  password: string (min: 1)
}
```

## Test Backend Directly

### Test Health Check
```bash
curl http://localhost:5001/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Test Registration with Verbose Output
```bash
curl -v -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Look for the response body showing the exact error.

## Fix Frontend Forms

If the issue is in the frontend, check:

### SignupPage.tsx
```typescript
// Ensure state is properly initialized
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Ensure mutation sends correct data
const signupMutation = useMutation({
  mutationFn: () => authService.register(name, email, password),
  // ...
});
```

### LoginPage.tsx
```typescript
// Ensure state is properly initialized
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Ensure mutation sends correct data
const loginMutation = useMutation({
  mutationFn: () => authService.login(email, password),
  // ...
});
```

## Still Getting 400?

1. **Check backend terminal** for exact error message
2. **Check browser Network tab** for request payload
3. **Verify MongoDB is connected** (backend should show "✅ MongoDB connected")
4. **Try with curl** to isolate if it's frontend or backend issue

## Quick Test

Try this in browser console on the signup page:

```javascript
// Test the API directly
fetch('http://localhost:5001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

This will show you the exact response from the server.

---

**Most likely cause:** Email already exists in database or password is too short.

**Quick fix:** Use a unique email and password with 6+ characters.
