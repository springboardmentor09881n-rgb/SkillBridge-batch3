# SkillBridge Frontend

A basic HTML/CSS/JavaScript frontend application with a React-like file structure.

## Project Structure

```
skillbridge-frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── js/
│   │   ├── api.js          # API service for backend communication
│   │   └── app.js          # Main application logic
│   └── styles/
│       └── style.css       # Application styles
├── package.json
└── README.md
```

## Features

- **Login & Signup**: User authentication with backend API
- **Users List**: View all registered users
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and professional design

## API Endpoints Used

The frontend connects to these backend endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

## How to Run

1. Make sure your backend server is running on `http://localhost:8080`

2. Open the `public/index.html` file in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with Browser", or
   - Use a local server (recommended for development)

### Using Live Server (Recommended)

If you have VS Code with Live Server extension:

1. Right-click on `public/index.html`
2. Select "Open with Live Server"

### Using Python HTTP Server

```bash
cd skillbridge-frontend/public
python -m http.server 3000
```

Then open `http://localhost:3000` in your browser.

## Configuration

The backend API URL is configured in `src/js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

Change this if your backend is running on a different port or host.

## Usage

1. **Home Page**: Landing page with welcome message
2. **Signup**: Create a new account with username, full name, email, and password
3. **Login**: Log in with your email and password
4. **Users**: View all registered users (only visible after login)

## Browser Compatibility

This application uses modern JavaScript features and should work in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- User session is stored in `localStorage`
- Passwords are sent in plain text (use HTTPS in production)
- CORS is enabled in the backend (`@CrossOrigin(origins = "*")`)
