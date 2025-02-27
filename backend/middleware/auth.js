const jwt = require('jsonwebtoken');

const tokenRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      code: 401,
    });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Attach user info to the request
    req.user = {
      id: decoded.user_id,
      username: decoded.username,
    };
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      code: 401,
    });
  }
};


module.exports = { tokenRequired };