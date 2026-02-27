// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const remember = document.getElementById('remember').checked;

            // Basic validation
            if (!username || !password) {
                showMessage('Please enter both username and password', 'error');
                return;
            }

            // Simple authentication (in real app, this would be server-side)
            // Default credentials: admin / admin123
            if (username === 'admin' && password === 'admin123') {
                // Store login data in localStorage
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUser', username);
                
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedUsername', username);
                }

                showMessage('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage('Invalid username or password', 'error');
            }
        });

        // Load saved username if remember me was checked
        const rememberMe = localStorage.getItem('rememberMe');
        if (rememberMe === 'true') {
            const savedUsername = localStorage.getItem('savedUsername');
            document.getElementById('username').value = savedUsername || '';
            document.getElementById('remember').checked = true;
        }

        // Check if already logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            window.location.href = 'dashboard.html';
        }
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
}


