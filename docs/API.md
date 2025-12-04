# PhysVerse API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Email already registered
- 400: Validation failed

### POST /auth/login

Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: Invalid credentials

### GET /auth/me

Get current user information (requires authentication).

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: Not authenticated
- 404: User not found

## Simulations

### POST /simulations

Create a new simulation (requires authentication).

**Request Body:**
```json
{
  "name": "My Projectile",
  "type": "projectile",
  "parameters": {
    "velocity": 20,
    "angle": 45,
    "gravity": 9.8
  },
  "isPublic": false
}
```

**Response (201):**
```json
{
  "simulation": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "My Projectile",
    "type": "projectile",
    "parameters": {
      "velocity": 20,
      "angle": 45,
      "gravity": 9.8
    },
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Simulation Types:**
- `projectile` - Projectile motion
- `spring-mass` - Spring-mass system
- `two-body-orbit` - Two-body orbital mechanics

### GET /simulations

Get all simulations for the authenticated user.

**Response (200):**
```json
{
  "simulations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "name": "My Projectile",
      "type": "projectile",
      "parameters": { ... },
      "isPublic": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /simulations/:id

Get a specific simulation by ID (requires authentication and ownership).

**Response (200):**
```json
{
  "simulation": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "My Projectile",
    "type": "projectile",
    "parameters": { ... },
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- 404: Simulation not found

### PUT /simulations/:id

Update a simulation (requires authentication and ownership).

**Request Body:**
```json
{
  "name": "Updated Name",
  "parameters": {
    "velocity": 25,
    "angle": 50,
    "gravity": 9.8
  },
  "isPublic": true
}
```

**Response (200):**
```json
{
  "simulation": { ... }
}
```

### DELETE /simulations/:id

Delete a simulation (requires authentication and ownership).

**Response (200):**
```json
{
  "message": "Simulation deleted successfully"
}
```

## Public Gallery

### GET /public/simulations

Get all public simulations.

**Response (200):**
```json
{
  "simulations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe"
      },
      "name": "Cool Orbit",
      "type": "two-body-orbit",
      "parameters": { ... },
      "isPublic": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /public/simulations/:id

Get a specific public simulation by ID.

**Response (200):**
```json
{
  "simulation": { ... }
}
```

**Errors:**
- 404: Simulation not found or not public

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [ ... ] // Optional validation details
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
