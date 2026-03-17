# SkillBridge Backend

Backend REST API for the SkillBridge platform.

## Tech Stack

- Java 21
- Spring Boot 4
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL

## Prerequisites

- Java 21 installed
- PostgreSQL running locally

## Configuration

1. Create the database:

```sql
CREATE DATABASE skillbridge_db;
```

2. Update database settings in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/skillbridge_db
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

## Run Locally (Windows)

From this folder (`skillbridge-backend`):

```bash
mvnw.cmd spring-boot:run
```

Backend runs at: `http://localhost:8080`

## Common API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `POST /api/opportunities/create/{ngoId}`
- `GET /api/opportunities/all`
- `GET /api/opportunities/ngo/{ngoId}`
- `GET /api/opportunities/filter`
- `PUT /api/opportunities/{id}`
- `DELETE /api/opportunities/{id}`
- `POST /api/applications/apply`
- `POST /api/applications/submit`
- `GET /api/applications/opportunity/{id}`
- `GET /api/applications/volunteer/{id}`
- `PUT /api/applications/{id}`

## Test

```bash
mvnw.cmd test
```