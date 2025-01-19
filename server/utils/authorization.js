import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.token || 
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: "Authentication required" 
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            status: 'error',
            message: "Token has expired" 
          });
        }
        return res.status(403).json({ 
          status: 'error',
          message: "Invalid token" 
        });
      }

      // Add user info to request
      req.user = {
        user_id: decoded.user_id,
        email: decoded.email,
        name: decoded.name
      };
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: "Authentication error" 
    });
  }
};

export default authenticateToken;
