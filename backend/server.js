const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./utils/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// WebSocket server setup
const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    // Authenticate WebSocket connection
    ws.on('message', (message) => {
        try {
            const { token, data } = JSON.parse(message);
            const user = authenticateToken(token);
            if (user) {
                // Handle WebSocket messages here
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ username: user.username, message: data, timestamp: new Date().toLocaleTimeString() }));
                    }
                });
            } else {
                ws.close();
            }
        } catch (err) {
            ws.close();
        }
    });
});




