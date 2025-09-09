# Uber-Clone Backend API Documentation

This backend provides user authentication and profile management for an Uber-like application. It is built with Node.js, Express, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Get User Profile](#get-user-profile)
  - [Logout User](#logout-user)
- [Models](#models)
- [Error Handling](#error-handling)

---

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your `.env` file with the following variables:
   - `JWT_SECRET=<your_secret>`
   - `MONGO_URI=<your_mongodb_uri>`
4. Start the server:  
   ```
   npm start
   ```

---

## API Endpoints

### 1. Register User

**Endpoint:**  
`POST /api/users/register`

**Description:**  
Registers a new user with first name, last name, email, and password.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses:**
- `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "token": "<jwt_token>",
    "user": { ...userObject }
  }
  ```
- `400 Bad Request`
  ```json
  {
    "errors": [
      { "msg": "First name is required", ... }
    ]
  }
  ```
- `500 Internal Server Error`
  ```json
  {
    "error": "Error message"
  }
  ```

---

### 2. Login User

**Endpoint:**  
`POST /api/users/login`

**Description:**  
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses:**
- `201 Created`
  ```json
  {
    "message": "Login successful",
    "token": "<jwt_token>",
    "user": { ...userObject }
  }
  ```
- `400 Bad Request`
  ```json
  {
    "errors": [
      { "msg": "Please provide a valid email", ... }
    ]
  }
  ```
- `401 Unauthorized`
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

---

### 3. Get User Profile

**Endpoint:**  
`GET /api/users/profile`

**Description:**  
Returns the authenticated user's profile. Requires JWT token in cookie or `Authorization` header.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Responses:**
- `200 OK`
  ```json
  {
    "user": { ...userObject }
  }
  ```
- `401 Unauthorized`
  ```json
  {
    "error": "Authentication required"
  }
  ```

---

### 4. Logout User

**Endpoint:**  
`GET /api/users/logout`

**Description:**  
Logs out the user by blacklisting the JWT token for 1 minute.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Responses:**
- `200 OK`
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## Models

### User Model

- `fullname`: `{ firstname: String, lastname: String }`
- `email`: `String` (unique)
- `password`: `String` (hashed)
- `socktId`: `String` (optional)

### BlacklistToken Model

- `token`: `String` (unique, JWT token)
- `createdAt`: `Date` (auto, expires after 1 minute)

---

## Error Handling

All errors return a JSON response with an appropriate HTTP status code and error message.

---

## Example Usage

### Register

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Profile

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

### Logout

```bash
curl -X GET http://localhost:3000/api/users/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Notes

- All endpoints are prefixed with `/api/users`.
- JWT tokens expire in 60 seconds.
- Blacklisted tokens are stored for 1 minute.