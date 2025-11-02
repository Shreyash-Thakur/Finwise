/**
 * Session-based authentication middleware
 * Checks if user is authenticated via session
 */
export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    error: 'Authentication Required',
    message: 'You must be logged in to access this resource',
  });
};

/**
 * Optional session authentication
 * Adds user to request if authenticated but doesn't fail if not
 */
export const optionalSessionAuth = (req, res, next) => {
  // User will be available in req.user if authenticated
  next();
};

/**
 * Combined authentication middleware
 * Supports both JWT and session authentication
 */
export const hybridAuth = async (req, res, next) => {
  // First check for JWT token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const jwt = await import('jsonwebtoken');
      const { config } = await import('../config/env.js');
      const { User } = await import('../models/index.js');
      
      const decoded = jwt.default.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          kycStatus: user.kycStatus,
          authType: 'jwt'
        };
        return next();
      }
    } catch (error) {
      // JWT failed, fall through to session check
    }
  }
  
  // Check session authentication
  if (req.isAuthenticated()) {
    req.user.authType = 'session';
    return next();
  }
  
  // No authentication found
  res.status(401).json({
    success: false,
    error: 'Authentication Required',
    message: 'Please login to access this resource',
  });
};

/**
 * Role-based authorization for session auth
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient Permissions',
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};