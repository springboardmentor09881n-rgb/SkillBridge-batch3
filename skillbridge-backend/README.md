# SkillBridge Backend - Basic Version

Super simple authentication API - just the bare minimum.

## Structure

```
src/main/java/com/skillbridge/
├── controller/
│   ├── AuthController.java    # Login & Signup
│   └── UserController.java    # Get users
├── model/
│   └── User.java              # User entity (plain Java)
└── repository/
    └── UserRepository.java    # Database access
```

## Setup

1. **Create Database:**
```sql
CREATE DATABASE skillbridge_db;
```

2. **Update `application.properties`:**
```properties
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

3. **Run:**
```bash
mvnw.cmd spring-boot:run
```

Server runs on: `http://localhost:8080`

## API Endpoints

### Signup
```
POST http://localhost:8080/api/auth/signup

Body:
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response:
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "fullName": "John Doe",
  "message": "Signup successful"
}
```

### Login
```
POST http://localhost:8080/api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "fullName": "John Doe",
  "message": "Login successful"
}
```

### Get All Users
```
GET http://localhost:8080/api/users
```

### Get User by ID
```
GET http://localhost:8080/api/users/1
```

## Frontend Integration

```javascript
// Signup
fetch('http://localhost:8080/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Login
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Notes

- **No security** - Passwords stored in plain text
- **No validation** - Add validation as needed
- **No authentication** - All endpoints are public
- **CORS enabled** - Frontend can call from anywhere

This is a starter template. Add security, validation, and authentication as your project grows.
