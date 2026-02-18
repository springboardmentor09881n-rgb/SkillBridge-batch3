### SkillBridge Backend
> Backend REST API for the SkillBridge platform — connecting volunteers with NGOs.

### Project Structure

```
src/main/java/com/skillbridge/
├── SkillbridgeBackendApplication.java   # Main application entry point
├── controller/
│   ├── AuthController.java              # Signup & Login endpoints
│   └── UserController.java              # User CRUD endpoints
├── model/
│   └── User.java                        # User entity (JPA)
└── repository/
    └── UserRepository.java              # Database access (Spring Data JPA)
```

## Setup
> **1. Create the database:**
```sql
CREATE DATABASE skillbridge_db;
```

>  **2. Update `src/main/resources/application.properties`:**
```properties
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/skillbridge_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

>  **3. Run the application:**
```bash
# Windows
mvnw.cmd spring-boot:run
```
> Server starts on: `http://localhost:8080`