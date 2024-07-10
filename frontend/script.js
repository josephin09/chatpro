document.addEventListener('DOMContentLoaded', () => {
    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');

    if (showLogin && showRegister) {
        showLogin.addEventListener('click', () => {
            if (registerContainer && loginContainer) {
                registerContainer.classList.add('hidden');
                loginContainer.classList.remove('hidden');
            }
        });

        showRegister.addEventListener('click', () => {
            if (registerContainer && loginContainer) {
                loginContainer.classList.add('hidden');
                registerContainer.classList.remove('hidden');
            }
        });
    }

    if (document.getElementById('register-button')) {
        document.getElementById('register-button').onclick = async () => {
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                if (!response.ok) {
                    throw new Error('Registration failed');
                }

                document.getElementById('register-message').innerText = 'Registration successful! Please login.';
                document.getElementById('register-message').classList.remove('error-message'); // Remove error class if previously set
                document.getElementById('register-message').classList.add('success-message'); // Add success class for green color
            } catch (error) {
                document.getElementById('register-message').innerText = `Error: ${error.message}`;
                document.getElementById('register-message').classList.remove('success-message'); // Remove success class if previously set
                document.getElementById('register-message').classList.add('error-message'); // Add error class for red color
            }
        };
    }

    // Login
    if (document.getElementById('login-button')) {
        document.getElementById('login-button').onclick = async () => {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const { token } = await response.json();
                localStorage.setItem('token', token);
                document.getElementById('login-message').innerText = 'Login successful!';
                document.getElementById('login-message').classList.remove('error-message'); // Remove error class if previously set
                document.getElementById('login-message').classList.add('success-message'); // Add success class for green color
                window.location.href = 'chat.html'; // Redirect to chat.html on successful login
            } catch (error) {
                document.getElementById('login-message').innerText = `Error: ${error.message}`;
                document.getElementById('login-message').classList.remove('success-message'); // Remove success class if previously set
                document.getElementById('login-message').classList.add('error-message'); // Add error class for red color
            }
        };
    }

    // Chat
if (window.location.pathname.endsWith('chat.html')) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        document.getElementById('send-button').onclick = () => {
            const message = document.getElementById('message-input').value;
            ws.send(JSON.stringify({ token, data: message }));
        };
    };

    ws.onmessage = (event) => {
        const { username, message, timestamp } = JSON.parse(event.data);
        const chatHistory = document.getElementById('chat-history');
        const newMessage = document.createElement('div');
        newMessage.innerText = `[${timestamp}] ${username}: ${message}`;
        chatHistory.appendChild(newMessage);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
}
});

