const jwt = require('jsonwebtoken');

function tokenRequired(req, res, next) {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return req.status(403).json({ message: "Token is missing!" });
    }

    const token = authHeader.split(' ')[1]  // Extract token from `Bearer <token>`

    if (!token) {
        return req.status(403).json({ message: "Token is missing!" });
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token,secretKey);
        req.current_user = decoded.user_id; // Attach user info into the request object
        next();     // Proceed to the next middleware
    } catch (error) {
        return req.status(403).json({ message: 'Token is invalid!', error: error.message });
    }
}

module.exports = tokenRequired;