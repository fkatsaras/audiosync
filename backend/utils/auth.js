const jwt = require('jsonwebtoken');

const tokenRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      code: 401,
    });
  }

  console.log(authHeader);

  const token = authHeader.split(' ')[1];

  console.log(token);


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.current_user = decoded.username; // Set username from token payload
    req.current_user_id = decoded.user_id; // If user_id exists in payload
    next(); // Proceed to next middleware or route
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      code: 401,
    });
  }
};

module.exports = { tokenRequired };