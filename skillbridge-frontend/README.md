# SkillBridge Frontend

React + Vite frontend for the SkillBridge platform.

## Tech Stack

- React 19
- React Router
- Vite
- ESLint

## Prerequisites

- Node.js 18+ (recommended)
- npm
- SkillBridge backend running at `http://localhost:8080`

## Setup

From this folder (`skillbridge-frontend`):

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## App Routes

- `/` -> redirects to `/home`
- `/home` -> Home page
- `/login` -> Login page
- `/signup` -> Signup page
- `/ngo-dashboard` -> NGO dashboard
- `/volunteer-dashboard` -> Volunteer dashboard
- `/opportunities` -> Opportunities page

## Backend Integration

The frontend uses:

- Base URL: `http://localhost:8080/api`
- Auth login: `POST /auth/login`
- Auth signup: `POST /auth/signup`

If your backend runs on a different URL, update API base URL in:

- `src/services/api.js`
- `src/js/api.js`
