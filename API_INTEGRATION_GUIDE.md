# PhysVerse API Integration Guide

## Step-by-Step Integration & Testing

### Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

---

## Phase 1: Backend Setup (15 minutes)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected packages:**
- express
- mongoose
- bcryptjs
- jsonwebtoken
- zod
- cors
- helmet
- dotenv
- express-rate-limit

### Step 2: Configure Environment Variables

Create `backend/.env`:

```bash
# Copy example file
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/physverse
JWT_SECRET=your-super-secret-key-min-32-characters-long-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate secure JWT_SECRET:**

```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# macOS/Linux
openssl rand -hex 32
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**

```bash
# Windows
mongod

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (for development)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
🌍 Environment: development
✅ MongoDB connected successfully
```

### Step 5: Test Backend Health

Open browser or use curl:

```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-04T10:30:00.000Z"
}
```

✅ **Backend is ready!**

---

## Phase 2: Frontend Setup (10 minutes)

### Step 6: Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Key packages:**
- react
- react-router-dom
- @tanstack/react-query
- @react-three/fiber
- @react-three/drei
- three
- axios
- zustand
- tailwindcss
- react-hot-toast

### Step 7: Install Additional Dependencies

```bash
npm install react-hot-toast
```

### Step 8: Configure Frontend Environment

Create `frontend/.env`:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 9: Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 10: Open Application

Open browser: http://localhost:5173

✅ **Frontend is ready!**

---

## Phase 3: Test API Integration (20 minutes)

### Test 1: User Registration

**Via Browser:**
1. Go to http://localhost:5173/signup
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"

**Expected:**
- Success toast notification
- Redirect to dashboard
- User logged in

**Via API (curl):**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Test 2: User Login

**Via Browser:**
1. Go to http://localhost:5173/login
2. Enter credentials
3. Click "Sign In"

**Via API:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token for next tests!**

### Test 3: Get Current User

**Via API:**

```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Test 4: Create Simulation

**Via Browser:**
1. Go to dashboard
2. Click "New Simulation"
3. Choose simulation type
4. Adjust parameters
5. Click "Save"

**Via API:**

```bash
curl -X POST http://localhost:5000/api/simulations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My First Simulation",
    "type": "projectile",
    "parameters": {
      "velocity": 20,
      "angle": 45,
      "gravity": 9.8
    },
    "isPublic": false
  }'
```

**Expected response:**
```json
{
  "simulation": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "name": "My First Simulation",
    "type": "projectile",
    "parameters": {
      "velocity": 20,
      "angle": 45,
      "gravity": 9.8
    },
    "isPublic": false,
    "createdAt": "2024-12-04T10:30:00.000Z",
    "updatedAt": "2024-12-04T10:30:00.000Z"
  }
}
```

### Test 5: Get All Simulations

**Via Browser:**
- Dashboard should show your simulations

**Via API:**

```bash
curl http://localhost:5000/api/simulations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 6: Update Simulation

**Via API:**

```bash
# Replace SIMULATION_ID with actual ID
curl -X PUT http://localhost:5000/api/simulations/SIMULATION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Updated Simulation",
    "parameters": {
      "velocity": 25,
      "angle": 50,
      "gravity": 9.8
    },
    "isPublic": true
  }'
```

### Test 7: Get Public Simulations

**Via Browser:**
- Go to http://localhost:5173/gallery

**Via API:**

```bash
curl http://localhost:5000/api/public/simulations
```

### Test 8: Delete Simulation

**Via Browser:**
1. Go to dashboard
2. Click delete button on simulation
3. Confirm

**Via API:**

```bash
curl -X DELETE http://localhost:5000/api/simulations/SIMULATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Phase 4: Verify Integration (10 minutes)

### Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check returns OK
- [ ] User registration works
- [ ] User login works
- [ ] Token is stored in localStorage
- [ ] Dashboard loads user simulations
- [ ] Can create new simulation
- [ ] Can edit simulation parameters
- [ ] Can save simulation
- [ ] Can delete simulation
- [ ] Can toggle public/private
- [ ] Public gallery shows public simulations
- [ ] 3D canvas renders simulation
- [ ] Play/pause/reset controls work
- [ ] Logout works

---

## Phase 5: Troubleshooting

### Backend Issues

**MongoDB Connection Failed**

```bash
# Check if MongoDB is running
mongosh

# If not running, start it
mongod
```

**Port Already in Use**

```bash
# Change PORT in backend/.env
PORT=5001
```

**CORS Errors**

Check `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Must match exactly (no trailing slash).

### Frontend Issues

**API Calls Failing**

Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Token Not Persisting**

Check browser console for localStorage errors.

**3D Canvas Not Rendering**

1. Check browser supports WebGL
2. Check console for Three.js errors
3. Verify simulation ID matches registry

---

## Phase 6: Testing with Postman/Insomnia

### Import Collection

Create a collection with these requests:

**1. Register**
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**2. Login**
- Method: POST
- URL: http://localhost:5000/api/auth/login
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**3. Get Me**
- Method: GET
- URL: http://localhost:5000/api/auth/me
- Headers: `Authorization: Bearer {{token}}`

**4. Create Simulation**
- Method: POST
- URL: http://localhost:5000/api/simulations
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):
```json
{
  "name": "Test Simulation",
  "type": "projectile",
  "parameters": {
    "velocity": 20,
    "angle": 45,
    "gravity": 9.8
  },
  "isPublic": false
}
```

**5. Get Simulations**
- Method: GET
- URL: http://localhost:5000/api/simulations
- Headers: `Authorization: Bearer {{token}}`

**6. Update Simulation**
- Method: PUT
- URL: http://localhost:5000/api/simulations/{{simulationId}}
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):
```json
{
  "name": "Updated Name",
  "isPublic": true
}
```

**7. Delete Simulation**
- Method: DELETE
- URL: http://localhost:5000/api/simulations/{{simulationId}}
- Headers: `Authorization: Bearer {{token}}`

**8. Get Public Simulations**
- Method: GET
- URL: http://localhost:5000/api/public/simulations

---

## Phase 7: Database Verification

### Check MongoDB Data

```bash
# Connect to MongoDB
mongosh

# Switch to database
use physverse

# View users
db.users.find().pretty()

# View simulations
db.simulations.find().pretty()

# Count documents
db.users.countDocuments()
db.simulations.countDocuments()

# Check indexes
db.users.getIndexes()
db.simulations.getIndexes()
```

---

## Common API Errors & Solutions

### 400 Bad Request
- **Cause:** Invalid input data
- **Solution:** Check request body matches schema

### 401 Unauthorized
- **Cause:** Missing or invalid token
- **Solution:** Login again, check Authorization header

### 404 Not Found
- **Cause:** Resource doesn't exist or wrong ID
- **Solution:** Verify ID, check ownership

### 500 Internal Server Error
- **Cause:** Server error
- **Solution:** Check backend logs, verify MongoDB connection

---

## API Response Formats

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ]  // Optional validation details
}
```

---

## Rate Limiting

The API has rate limiting enabled:
- **Limit:** 100 requests per 15 minutes per IP
- **Response when exceeded:** 429 Too Many Requests

---

## Security Notes

### Development
- JWT_SECRET can be simple
- MongoDB can be local
- CORS allows localhost

### Production
- Use strong JWT_SECRET (32+ chars)
- Use MongoDB Atlas with authentication
- Restrict CORS to your domain
- Enable HTTPS
- Use environment variables
- Never commit .env files

---

## Next Steps

After successful integration:

1. **Test all user flows**
   - Registration → Login → Create → Edit → Delete → Logout

2. **Test edge cases**
   - Invalid credentials
   - Duplicate email
   - Missing fields
   - Invalid simulation types

3. **Performance testing**
   - Create multiple simulations
   - Test with large parameter sets
   - Check response times

4. **Deploy to production**
   - Follow DEPLOYMENT.md
   - Update environment variables
   - Test production endpoints

---

## Quick Reference

### Backend Endpoints

```
POST   /api/auth/register      - Register user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user

POST   /api/simulations        - Create simulation
GET    /api/simulations        - Get user simulations
GET    /api/simulations/:id    - Get simulation by ID
PUT    /api/simulations/:id    - Update simulation
DELETE /api/simulations/:id    - Delete simulation

GET    /api/public/simulations     - Get public simulations
GET    /api/public/simulations/:id - Get public simulation
```

### Frontend Routes

```
/                  - Landing page
/login             - Login page
/signup            - Signup page
/dashboard         - User dashboard
/simulation/new    - Create simulation
/simulation/:id    - Edit simulation
/gallery           - Public gallery
```

---

## Success Criteria

✅ All API endpoints respond correctly
✅ Authentication works end-to-end
✅ CRUD operations work for simulations
✅ Public gallery displays simulations
✅ Frontend and backend communicate properly
✅ No CORS errors
✅ No authentication errors
✅ Database stores data correctly

---

**You're now ready to use PhysVerse!** 🚀

For issues, check:
- Backend console logs
- Frontend browser console
- MongoDB logs
- Network tab in browser DevTools
