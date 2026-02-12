// State Management
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavbar();
        showPage('home');
    }
});

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');
    
    try {
        messageEl.textContent = 'Logging in...';
        messageEl.className = 'message info';
        
        const response = await ApiService.login(email, password);
        
        // Save user data
        currentUser = response;
        localStorage.setItem('currentUser', JSON.stringify(response));
        
        // Show success message
        messageEl.textContent = response.message || 'Login successful!';
        messageEl.className = 'message success';
        
        // Update navbar
        updateNavbar();
        
        // Redirect to home after 1 second
        setTimeout(() => {
            showPage('home');
            document.getElementById('loginForm').reset();
            messageEl.textContent = '';
        }, 1000);
        
    } catch (error) {
        messageEl.textContent = error.message || 'Login failed. Please try again.';
        messageEl.className = 'message error';
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const fullName = document.getElementById('signupFullName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const messageEl = document.getElementById('signupMessage');
    
    try {
        messageEl.textContent = 'Creating account...';
        messageEl.className = 'message info';
        
        const userData = {
            username,
            fullName,
            email,
            password
        };
        
        const response = await ApiService.signup(userData);
        
        // Save user data
        currentUser = response;
        localStorage.setItem('currentUser', JSON.stringify(response));
        
        // Show success message
        messageEl.textContent = response.message || 'Signup successful!';
        messageEl.className = 'message success';
        
        // Update navbar
        updateNavbar();
        
        // Redirect to login after 1 second
        setTimeout(() => {
            showPage('login');
            document.getElementById('signupForm').reset();
            messageEl.textContent = '';
        }, 1000);
        
    } catch (error) {
        messageEl.textContent = error.message || 'Signup failed. Please try again.';
        messageEl.className = 'message error';
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavbar();
    showPage('login');
}

// Update navbar based on login status
function updateNavbar() {
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const homeLink = document.getElementById('homeLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (currentUser) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        homeLink.style.display = 'inline';
        logoutLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        signupLink.style.display = 'inline';
        homeLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}
