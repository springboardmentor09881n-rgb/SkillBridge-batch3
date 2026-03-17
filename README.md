# SkillBridge - Batch 3

SkillBridge connects volunteers with NGOs through a full-stack web platform.

## Repositories

- Frontend (React + Vite): [skillbridge-frontend/README.md](./skillbridge-frontend/README.md)
- Backend (Spring Boot + PostgreSQL): [skillbridge-backend/README.md](./skillbridge-backend/README.md)

## Quick Start

1. Start PostgreSQL and create a database named `skillbridge_db`.
2. Configure backend database credentials in `skillbridge-backend/src/main/resources/application.properties`.
3. Run backend from `skillbridge-backend`:
	```bash
	mvnw.cmd spring-boot:run
	```
4. Run frontend from `skillbridge-frontend`:
	```bash
	npm install
	npm run dev
	```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`