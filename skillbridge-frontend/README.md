### SkillBridge Frontend
> A React-based frontend for the SkillBridge platform — connecting volunteers with NGOs to create real community impact.

#### Pages

| Route | Component | Description |
|---|---|---|
| `/` | Home | Landing page (requires login) |
| `/login` | Login | Email/password login |
| `/signup` | Signup | Account creation with role selection (Volunteer / NGO) |
| `/volunteer-dashboard` | VolunteerDashboard | Profile view for volunteers |
| `/ngo-dashboard` | NgoDashboard | Profile view for NGOs |


#### Project Structure
```
src/
├── components/
│   ├── Navbar.jsx / Navbar.css
│   ├── Home.jsx / Home.css
│   ├── Login.jsx / Login.css
│   ├── Signup.jsx / Signup.css
│   ├── NgoDashboard.jsx
│   ├── VolunteerDashboard.jsx
│   └── Dashboard.css
├── services/
├── App.jsx / App.css
├── index.css
└── main.jsx
```

#### Backend API
The frontend expects the backend at `http://localhost:8080` with these endpoints:
-  `POST /api/auth/login` — Login with email & password
- `POST /api/auth/signup` — Register a new account
