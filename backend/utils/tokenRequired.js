function tokenRequired(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: "Token is missing!" }); // Use `res`
    }

    const token = authHeader.split(' ')[1]; // Extract token from `Bearer <token>`

    if (!token) {
        return res.status(403).json({ message: "Token is missing!" }); // Use `res`
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        req.current_user = decoded.user_id; // Attach user info to the request object
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(403).json({ message: 'Token is invalid!', error: error.message }); // Use `res`
    }
}

module.exports = tokenRequired;
