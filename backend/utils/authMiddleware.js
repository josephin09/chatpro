const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret';

const authenticateToken = (token) => {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        return null;
    }
};

module.exports = { authenticateToken };
