# API Documentation

## User Registration

- **Endpoint:** `POST /register`
- **Description:** This endpoint allows a new user to register by providing their fullname, email, and password.
- **Request Body:**
  {
  "fullname": {
  "firstname": "John",
  "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword"
  }
- **Response:**
  - **Success (201):**
    {
    "message": "User registered successfully",
    "token": "JWT_TOKEN",
    "user": {
    "fullname": {
    "firstname": "John",
    "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    }
    }
  - **Error (400):**
    {
    "errors": [
    {
    "msg": "First name is required",
    "param": "fullname.firstname",
    "location": "body"
    }
    ]
    }
  - **Error (500):**
    {
    "error": "Error message"
    }
